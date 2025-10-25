const isProd = process.env.NODE_ENV === 'production';
const REPO_NAME = 'ItsEco';
module.exports = {
  output: 'export',
  images: { unoptimized: true },
  basePath: isProd ? `/${REPO_NAME}` : '',
  assetPrefix: isProd ? `/${REPO_NAME}/` : ''
};
