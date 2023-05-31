import pandas as pd
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException
from ..SongId import get_track_artist, get_track_title


def get_ascap_results(song, performer):
    options = Options()
    options.add_argument("--incongnito")
    # options.add_argument("--headless")
    options.add_argument('--verbose')
    options.add_argument(
        '--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36')

    service = Service("env/lib/chromedriver")

    driver = webdriver.Chrome(options=options, service=service)

    driver.get("https://www.ascap.com/repertory#/")

    # Wait for the iframe and switch to it
    WebDriverWait(driver, 10).until(
        EC.frame_to_be_available_and_switch_to_it(
            (By.CLASS_NAME, "truste_popframe"))
    )

    WebDriverWait(driver, 20).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "a.call"))
    ).click()

    driver.switch_to.default_content()

    search_title = driver.find_element(
        By.XPATH, '//*[@id="quaverTextInput-25"]')
    # search_title.send_keys(get_track_title())
    search_title.send_keys(song)
    # search_title.send_keys('steampunk')

    if performer:
        search_artist = driver.find_element(
            By.XPATH, '//*[@id="quaverTextInput-29"]')
        # search_artist.send_keys(get_track_artist())
        search_artist.send_keys(performer)

        search_artist.send_keys(Keys.RETURN)

    else:
        search_title.send_keys(Keys.RETURN)

    terms_and_conditions = WebDriverWait(driver, 20).until(EC.element_to_be_clickable(
        (By.XPATH,
         "/html/body/div[3]/div[3]/div/div[1]/div/div/div[2]/div[4]/button")
    ))
    terms_and_conditions.click()

    skip = WebDriverWait(driver, 20).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "button.c-btn.c-btn--basic")))
    skip.click()

    titles = []
    performers_list = []
    writers_list = []
    publishers_list = []
    publishers_address_list = []
    phone_numbers_list = []
    publishers_email_list = []
    # publishers_website_list = []

    n = 1
    while True:
        print(f'ASCAP Page: {n}')
        n += 1

        if not performer:
            try:
                # Scroll to the top of the page
                driver.execute_script("window.scrollTo(0, 0);")
                expand_all = WebDriverWait(driver, 10).until(
                    EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Expand All')]")))
                expand_all.click()
            except:
                pass

        try:
            print('try')
            no_results = WebDriverWait(driver, 12).until(
                EC.presence_of_element_located(
                    (By.CLASS_NAME, 'c-empty-state'))
            )
            # no_results = driver.find_element(By.CLASS_NAME, 'c-empty-state')
            if no_results:
                print("NO ASCAP RESULTS")
                return {}
        except:
            print('except')
            pass

        # handle alternate titles
        results_url = driver.current_url
        if 'at=false' in results_url:
            modified_results_url = results_url.replace('at=false', 'at=true')
            print(modified_results_url)
            driver.get(modified_results_url)
        else:
            print("URL parameter 'at=false' not found.")

        results = WebDriverWait(driver, 20).until(
            EC.presence_of_all_elements_located((By.TAG_NAME, 'article'))
        )

        soups = []

        for result in results:
            html_content = result.get_attribute("innerHTML")
            soups.append(BeautifulSoup(html_content, 'html.parser'))

        r = 1
        for soup in soups:
            # Extract data from the current page
            header = soup.find('header', class_='c-card__header')
            title = header.find('h2').text.strip()
            titles.append(title)

            performers_section = soup.find(
                lambda tag: tag.name == 'h3' and 'Performers' in tag.get_text()).parent
            performers_ul = performers_section.find_all(
                'li', class_='creditor__item')
            performers = [performer.get_text(strip=True)
                          for performer in performers_ul]
            performers_list.append(
                performers) if performers else performers_list.append(
                ['No performers associated with this title'])

            writers_section = soup.find(
                lambda tag: tag.name == 'h3' and 'Writers' in tag.get_text()).parent
            writers_rows = writers_section.find_all('tr')[1:]
            writers = []
            for row in writers_rows:
                if row.find('a'):
                    writers.append(row.find('a').get_text(strip=True))
                else:
                    writers.append(row.find('td').get_text(strip=True))
            writers_list.append(writers)

            publishers_section = soup.find(
                lambda tag: tag.name == 'h3' and 'Publishers' in tag.get_text()).parent

            publishers_rows = publishers_section.find_all('tr')[1:]
            publishers = []
            for row in publishers_rows:
                if row.find('a'):
                    publishers.append(row.find('a').get_text(strip=True))
                else:
                    publishers.append(''.join(row.find('td').find_all(
                        string=True, recursive=False)).strip())

                phone_numbers_links = soup.select('tr a[href^="tel:"]')
                phone_numbers = [number.get_text(
                    strip=True) for number in phone_numbers_links if '(' in number.get_text(strip=True)]

                email_links = soup.select('tr a[href^="mailto:"]')
                emails = [email.get_text(
                    strip=True) for email in email_links if '@' in email.get_text(strip=True)]

                address_section = soup.select('address')
                addresses = [' '.join(section.stripped_strings)
                             for section in address_section]

            publishers_list.append(publishers)
            publishers_address_list.append(
                addresses) if addresses else publishers_address_list.append(['No address listed'])
            phone_numbers_list.append(phone_numbers) if phone_numbers else phone_numbers_list.append(
                ['No phone number listed'])
            publishers_email_list.append(
                emails) if emails else publishers_email_list.append(['No email listed'])
            print(title)

            print(f'ASCAP Page Result: {r}')
            r += 1

            # Check if there is a next button
        next_button = None
        try:
            pagination = driver.find_element(By.CLASS_NAME, 'pagination__list')
            next_button = pagination.find_element(
                By.XPATH, '//a[@aria-label="Go to next page"]')
        except NoSuchElementException:
            break

        # Click on the "Next" button
        next_button.click()
    print("CREATE DATA")
    # Create df and export
    data = {
        'title': titles,
        'performers': performers_list,
        'writers': writers_list,
        'publishers': publishers_list,
        'publishers_address': publishers_address_list,
        'publishers_phone_number': phone_numbers_list,
        'publishers_email': publishers_email_list,
        # 'publishers_website': publishers_website_list,
    }
    print("CREATE DATA FINISHED")
    print(data)

    df = pd.DataFrame(data)
    # df.to_csv('ascap.csv', index=False)

    # driver.implicitly_wait(1000)
    driver.quit()

    return data
