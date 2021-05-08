from selenium import webdriver

'''
https://www.youtube.com/watch?v=Xjv1sY630Uc

I've followed the tutorial above for setting up selenium, 
the code below is test code from the tutorial
'''

PATH = "C:\Program Files (x86)\chromedriver.exe"
speed = 2.0
script = "document.querySelector('video').playbackRate =" + str(speed) + ";" 

#driver = webdriver.Chrome(PATH);

driver = webdriver.Chrome(PATH)

url = driver.command_executor._url       
session_id = driver.session_id 

driver = webdriver.Remote(command_executor=url,desired_capabilities={})
driver.close()   # this prevents the dummy browser
driver.session_id = session_id





#TODO add check for video to prevent crash if there is none
driver.get("https://www.youtube.com/watch?v=Xjv1sY630Uc")
driver.execute_script(script)