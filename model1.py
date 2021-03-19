import pandas as pd
import numpy as np
# from fastai.tabular.all import add_datepart
# from fastai.torch_basics import *
# from fastai.data.all import *


import matplotlib.pyplot as plt

from sklearn.preprocessing import MinMaxScaler
scaler = MinMaxScaler(feature_range=(0, 1))

# def make_date(df, date_field):
#     "Make sure `df[date_field]` is of the right date type."
#     field_dtype = df[date_field].dtype
#     if isinstance(field_dtype, pd.core.dtypes.dtypes.DatetimeTZDtype):
#         field_dtype = np.datetime64
#     if not np.issubdtype(field_dtype, np.datetime64):
#         df[date_field] = pd.to_datetime(df[date_field], infer_datetime_format=True)

# def add_datepart(df, field_name, prefix=None, drop=True, time=False):
#     "Helper function that adds columns relevant to a date in the column `field_name` of `df`."
#     make_date(df, field_name)
#     field = df[field_name]
#     prefix = ifnone(prefix, re.sub('[Dd]ate$', '', field_name))
#     attr = ['Year', 'Month', 'Day', 'Dayofweek', 'Dayofyear', 'Is_month_end', 'Is_month_start',
#             'Is_quarter_end', 'Is_quarter_start', 'Is_year_end', 'Is_year_start']
#     if time: attr = attr + ['Hour', 'Minute', 'Second']
#     for n in attr: df[prefix + n] = getattr(field.dt, n.lower())
#     # Pandas removed `dt.week` in v1.1.10
#     week = field.dt.isocalendar().week if hasattr(field.dt, 'isocalendar') else field.dt.week
#     df.insert(3, prefix+'Week', week)
#     mask = ~field.isna()
#     df[prefix + 'Elapsed'] = np.where(mask,field.values.astype(np.int64) // 10 ** 9,None)
#     if drop: df.drop(field_name, axis=1, inplace=True)
#     return df



df  = pd.read_csv('./datasets/BRITANNIA.csv')
#print(df.head())

# df['Date'] = pd.to_datetime(df.Date,format='%Y-%m-%d')
# df.index = df['Date']

new_data = pd.DataFrame(index=range(0,len(df)),columns=['Open', 'Close'])


for i in range(len(df)):
    new_data['Open'][i] = df['Open'][i]
    new_data['Close'][i] = df['Close'][i]


# add_datepart(new_data, 'Date')
# new_data.drop('Elapsed', axis=1, inplace=True) 



# new_data['mon_fri'] = 0

# print(new_data.tail())

# for i in range(0,len(new_data)):
#     if (new_data['Dayofweek'][i] == 0 or new_data['Dayofweek'][i] == 4):
#         new_data['mon_fri'][i] = 1
#     else:
#         new_data['mon_fri'][i] = 0

train = new_data[:3000]
valid = new_data[3000:]

x_train = train.drop('Close', axis=1)
y_train = train['Close']
x_test = valid.drop('Close', axis=1)
y_test = valid['Close']

x_train = np.array(x_train)
y_train = np.array(y_train)

# model = K.Sequential()
# model.add(K.layers.Dense(13,kernel_initializer='normal',activation = 'relu'))
# model.add(K.layers.Dense(1,activation = 'relu', kernel_initializer='normal'))
# model.compile(loss='mean_squared_error', optimizer='adam')

# model.fit(x_train,y_train)
# print(model.summary())

from sklearn.linear_model import LinearRegression
model = LinearRegression()
model.fit(x_train,y_train)


preds = model.predict(x_test)

valid['Predictions'] = 0
valid['Predictions'] = preds

valid.index = new_data[3000:].index
train.index = new_data[:3000].index


rms=(np.sqrt(np.mean(np.power((np.array(y_test)-np.array(preds)),2))))*15
print(rms)

plt.plot(train['Close'])
plt.plot(valid[['Predictions']])
plt.show()