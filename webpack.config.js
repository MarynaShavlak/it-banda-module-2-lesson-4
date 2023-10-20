const config = {
mode:'development',
entry: {
  index: './scripts/entry-scripts/index.js',
  // contacts: 'app/scripts/entry-scripts/contacts.js',
},
output: {
  filename: '[name].bundle.js'
},
module: {
  rules: [
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    },
  ],
},
};