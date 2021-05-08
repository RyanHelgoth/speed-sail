from selenium import webdriver

'''
https://www.youtube.com/watch?v=Xjv1sY630Uc

I've followed the tutorial above for setting up selenium, 
the code below is test code from the tutorial
'''

PATH = "C:\Program Files (x86)\chromedriver.exe"
driver = webdriver.Chrome(PATH);
driver.get("https://www.google.ca/")