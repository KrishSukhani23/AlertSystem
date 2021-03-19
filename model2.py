import math
import pandas_datareader as web
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from keras import *
import matplotlib.pyplot as plt

print("HI")
#Get the stock quote 
# df = web.DataReader('', data_source='yahoo', start='2012-01-01', end='2019-12-17') 
# #Show the data 
# df