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
from SongId import get_track_title

options = Options()
options.add_argument("--incongnito")

service = Service('env/lib/chromedriver')

driver = webdriver.Chrome(options=options, service=service)

driver.get("https://portal.themlc.com/search#work")

allow_cookies = WebDriverWait(driver, 20).until(EC.element_to_be_clickable(
    (By.ID, "CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll")))
allow_cookies.click()
driver.implicitly_wait(10)

element = driver.find_element(
    By.CSS_SELECTOR, "button.main-color-set.primary")
ActionChains(driver).move_to_element(element).click().perform()
driver.implicitly_wait(10)

search = driver.find_element(
    By.XPATH, '//*[@id="root"]/div/main/div/div[2]/div/div[2]/div/div[1]/form/div[1]/div[1]/div[2]/input')
search.send_keys(get_track_title())

search.send_keys(Keys.RETURN)

first_result = WebDriverWait(driver, 20).until(EC.element_to_be_clickable(
    (By.XPATH, '//*[@id="root"]/div/main/div/div[2]/div/div[2]/div/div[2]/section[2]/a[1]')))
driver.implicitly_wait(1000)
first_result.click()

driver.implicitly_wait(1000)


def fetch_mlc_html():
    r = requests.get("https://portal.themlc.com/search#work")
    if r.status_code == 200:
        return r.text

    else:
        raise Exception("an error occurred while fetching mlc data")


def extract_mlc_site_info(html):
    soup = BeautifulSoup(html, "html.parser")
