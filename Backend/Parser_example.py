from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Инициализация драйвера
driver = webdriver.Chrome()

try:
    # Открытие страницы
    driver.get("https://www.google.com")
    
    # Поиск и ввод текста
    search_box = driver.find_element(By.NAME, "q")
    search_box.send_keys("Selenium Python" + Keys.RETURN)
    
    # Ожидание результатов
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "search"))
    )
    
    # Получение и вывод заголовков результатов
    results = driver.find_elements(By.CSS_SELECTOR, "h3")
    for result in results:
        print(result.text)
        
finally:
    # Завершение работы
    driver.quit()
