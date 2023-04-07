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

driver.get("https://repertoire.bmi.com/")

search_title = driver.find_element(
    By.ID, 'Main_Search_Text')
search_title.send_keys(get_track_title())

driver.switch_to.default_content()

# driver.find_element(By.XPATH, '//*[@id="secondSelectDiv"]/div[1]').click()
element = driver.find_element(
    By.XPATH, '//*[@id="secondSelectDiv"]/div[1]')
ActionChains(driver).move_to_element(element).click().perform()

driver.find_element(
    By.XPATH, '//*[@id="secondSelectDiv"]/div[1]/span/span[2]').click()
driver.find_element(
    By.XPATH, '//*[@id="secondSelectDiv"]/div[1]/span/div/div/span/span/ul/li[3]/span'
).click()

search_artist = driver.find_element(
    By.ID, 'Sub_Search_Text')
search_artist.send_keys(get_track_artist())

search_artist.send_keys(Keys.RETURN)
driver.implicitly_wait(20)

terms_and_conditions = driver.find_element(
    By.ID, 'btnAccept')
terms_and_conditions.click()

open_icon = driver.find_element(By.CLASS_NAME, 'opener-icon')
open_icon.click()

creditors = driver.find_elements(
    By.TAG_NAME, 'td'
)

contact_info_expand_buttons = driver.find_elements(
    By.CLASS_NAME, 'expander')
[button.click() for button in contact_info_expand_buttons]

addresses = driver.find_elements(By.TAG_NAME, 'address')

for c in creditors:
    print(c.text)

for a in addresses:
    print(a.text)

driver.implicitly_wait(1000)
