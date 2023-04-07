import pandas as pd
import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from SongId import get_track_title, get_track_artist

options = Options()
options.add_argument("--incongnito")

service = Service('env/lib/chromedriver')

driver = webdriver.Chrome(options=options, service=service)

driver.get("https://www.ascap.com/repertory#/")

WebDriverWait(driver, 10).until(EC.frame_to_be_available_and_switch_to_it(
    (By.CLASS_NAME, "truste_popframe")))
WebDriverWait(driver, 20).until(
    EC.element_to_be_clickable((By.CSS_SELECTOR, "a.call"))
).click()

driver.switch_to.default_content()

search_title = driver.find_element(
    By.XPATH, '//*[@id="quaverTextInput-25"]')
search_title.send_keys(get_track_title())

search_artist = driver.find_element(
    By.XPATH, '//*[@id="quaverTextInput-29"]')
search_artist.send_keys(get_track_artist())

search_artist.send_keys(Keys.RETURN)
driver.implicitly_wait(20)

terms_and_conditions = driver.find_element(
    By.XPATH, '/html/body/div[3]/div[3]/div/div[1]/div/div/div[2]/div[4]/button')
terms_and_conditions.click()

skip = driver.find_element(By.CSS_SELECTOR, 'button.c-btn.c-btn--basic')
skip.click()

writers = driver.find_elements(
    By.CLASS_NAME, 'creditors__table'
)

publishers = driver.find_elements(
    By.XPATH, '//a[contains(@href, "publisher")]')

phone_contacts = driver.find_elements(
    By.XPATH, '//a[contains(@href, "tel")]'
)

email_contacts = driver.find_elements(
    By.XPATH, '//a[contains(@href, "mailto")]'
)

contact_info_expand_buttons = driver.find_elements(
    By.CSS_SELECTOR, 'button.c-btn.c-btn--anchor.h-color-m600.u-spacing-outside-bottom-sm')
[button.click() for button in contact_info_expand_buttons]

addresses = driver.find_elements(By.TAG_NAME, 'address')

for w in writers:
    print(w.text)

for p in publishers:
    print(p.text)

for ph in phone_contacts:
    print(ph.text)

for e in email_contacts:
    print(e.text)

for a in addresses:
    print(a.text)

driver.implicitly_wait(1000)
