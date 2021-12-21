export const dataSources = [
  { value: 'provideData', text: 'Provide Values' },
  { value: 'dataObject', text: 'Request Data' },
  { value: 'dataVariable', text: 'Data Variable' },
  { value: 'dataConnector', text: 'Data Connector' },
];

export const dataSourceValues = dataSources.reduce((values, source) => {
  values[source.value] = source.value;
  return values;
}, {});
