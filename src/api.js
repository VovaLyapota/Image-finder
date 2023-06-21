import axios from 'axios';

const BASE_API = 'https://pixabay.com/api';
const USER_API_KEY = '30212657-49bf01a0eca581be5ec93a0d0';

export default async function fetchUsersRequest(
  writedRequest,
  pageCounter,
  perPage
) {
  const response = await axios.get(
    `${BASE_API}/?key=${USER_API_KEY}&q=${writedRequest}&image_type=photo&orientation=horizontal&safesearch=true&page=${pageCounter}&per_page=${perPage}`
  );

  if (writedRequest === '' || response.data.total === 0) {
    throw new Error();
  }

  const finalyFechedInformation = response.data.hits.map(item => ({
    webformatURL: item.webformatURL,
    largeImageURL: item.largeImageURL,
    tags: item.tags,
    likes: item.likes,
    views: item.views,
    comments: item.comments,
    downloads: item.downloads,
  }));

  const totalHits = response.data.totalHits;

  return { finalyFechedInformation, totalHits };
}
