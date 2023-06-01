import pandas as pd
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from time import time


def get_bmi_results(song, performer):
    start_time = time()
    # Find results
    options = Options()
    options.add_argument("--incognito")
    options.add_argument("--headless")
    options.add_argument(
        '--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36')

    service = Service("env/lib/chromedriver")
    driver = webdriver.Chrome(options=options, service=service)

    driver.get("https://repertoire.bmi.com/")

    search_title = driver.find_element(By.ID, "Main_Search_Text")
    search_title.send_keys(song)

    if performer:
        driver.switch_to.default_content()

        element = driver.find_element(
            By.XPATH, '//*[@id="secondSelectDiv"]/div[1]')
        ActionChains(driver).move_to_element(element).click().perform()

        driver.find_element(
            By.XPATH, '//*[@id="secondSelectDiv"]/div[1]/span/span[2]').click()
        driver.find_element(
            By.XPATH, '//*[@id="secondSelectDiv"]/div[1]/span/div/div/span/span/ul/li[3]/span').click()

        search_artist = driver.find_element(By.ID, "Sub_Search_Text")
        search_artist.send_keys(performer)

        search_artist.send_keys(Keys.RETURN)
    else:
        search_title.send_keys(Keys.RETURN)

    terms_and_conditions = WebDriverWait(driver, 20).until(
        EC.element_to_be_clickable((By.ID, "btnAccept")))
    terms_and_conditions.click()

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
        print(f'BMI Page: {n}')
        n += 1

        try:
            no_results = driver.find_element(By.CLASS_NAME, 'no-results-body')
            if no_results:
                print("NO BMI RESULTS")
                return {}
        except:
            pass

        open_buttons = WebDriverWait(driver, 20).until(
            EC.presence_of_all_elements_located((By.CLASS_NAME, "opener-icon")))
        for button in open_buttons:
            driver.execute_script("arguments[0].click();", button)

        results = driver.find_elements(By.CLASS_NAME, 'view-details')
        soups = []

        for result in results:
            html_content = result.get_attribute("innerHTML")
            soups.append(BeautifulSoup(html_content, 'html.parser'))
        r = 1
        for soup in soups:
            # Extract data from the current page
            title_element = soup.find('td', class_='song-title')
            title = ''.join(content.strip()
                            for content in title_element if isinstance(content, str))
            titles.append(title)
            try:
                performers_ul = soup.find(
                    'strong', string='PERFORMER').find_next('ul')
                performers = [li.get_text(strip=True)
                              for li in performers_ul.find_all('li')]
                performers_list.append(performers)
            except:
                performers_list.append(
                    ['No performers associated with this title'])

            writers_ul = soup.find(
                'strong', string='Writer / Composer').find_next('ul')
            writers_names = [li.get_text(strip=True)
                             for li in writers_ul.find_all('li')]
            writers_list.append(writers_names)

            publishers_tags = soup.find_all('a', class_='expander')
            publishers = [tag.text.strip() for tag in publishers_tags]
            publishers_list.append(publishers)

            address_sections = soup.select('.expandable-slide-lt address')
            addresses = []
            emails = []
            # websites = []
            phone_numbers = []

            for section in address_sections:
                address_items = [
                    item for item in section.contents if item.name != 'a']
                address = ' '.join([item.get_text(separator=' ').strip()
                                    for item in address_items if item.string is not None]).strip() if address_items else 'No address listed'
                addresses.append(address)

                phone_number_link = section.select_one('a[href^="tel:"]')
                phone_number = phone_number_link.get_text(
                    strip=True).replace(' ', '') if phone_number_link else 'No phone number listed'
                phone_numbers.append(phone_number)

                email_link = section.select_one('a[href^="mailto:"]')
                email = email_link['href'][7:] if email_link else 'No email listed'
                emails.append(email)

                # website_link = section.select_one('a[target="_blank"]')
                # website = website_link['href'] if website_link and 'href' in website_link.attrs else 'No website listed'
                # websites.append(website)

            publishers_address_list.append(addresses)
            phone_numbers_list.append(phone_numbers)
            publishers_email_list.append(emails)
            # publishers_website_list.append(websites)
            print(f'BMI Page Result: {r}')
            r += 1

        # Check if there is a next button
        next_button = None
        try:
            pagination = driver.find_element(
                By.CLASS_NAME, 'pagination-container')
            next_button = pagination.find_element(
                By.XPATH, './/a[contains(text(), "Next")]')
        except NoSuchElementException:
            break

        # Click on the "Next" button
        next_button.click()

    print('BMI Scraper Finished')

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

    df = pd.DataFrame(data)
    # df.to_csv('bmi.csv', index=False)

    driver.quit()

    end_time = time()

    elapsed_time = end_time - start_time

    print(f"BMI elapsed run time: {elapsed_time} seconds")

    return data
