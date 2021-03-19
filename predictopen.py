import math
import pandas_datareader as web
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential,load_model
from keras.layers import Dense, LSTM
import matplotlib.pyplot as plt
from datetime import datetime
import sys

company = ['tcs','eichermotors','hdfcbank','britannia','bajajfinance','asianpaints','unilever','tatamotors','wipro','reliance']

a = datetime.today().strftime('%Y-%m-%d')

scaler = MinMaxScaler(feature_range=(0, 1)) 


model = load_model('./saved_open/' + company[int(sys.argv[1])])

predictstock = ['TCS.NS','EICHERMOT.NS','HDFCBANK.NS','BRITANNIA.NS','BAJFINANCE.NS','ASIANPAINT.NS','HINDUNILVR.NS','TATAMOTORS.NS','WIPRO.NS','RELIANCE.NS']

apple_quote = web.DataReader( predictstock[int(sys.argv[1])], data_source='yahoo', start='2020-08-08', end=a)
#Create a new dataframe
new_df = apple_quote.filter(['Open'])
#Get teh last 60 day closing price 
last_60_days = new_df[-60:].values
#Scale the data to be values between 0 and 1
last_60_days_scaled = scaler.fit_transform(last_60_days)
#Create an empty list
X_test = []
#Append teh past 60 days
X_test.append(last_60_days_scaled)
#Convert the X_test data set to a numpy array
X_test = np.array(X_test)
#Reshape the data
X_test = np.reshape(X_test, (X_test.shape[0], X_test.shape[1], 1))
#Get the predicted scaled price
pred_price = model.predict(X_test)
#undo the scaling 
pred_price = scaler.inverse_transform(pred_price)
print(pred_price[0][0])

sys.stdout.flush()