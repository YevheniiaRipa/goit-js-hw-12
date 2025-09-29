import axios from 'axios';

const API_KEY = '52357534-32b775e5278862406bf3d127c';
const BASE_URL = 'https://pixabay.com/api/';

export async function getImagesByQuery(query, page) {
  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 15,
    page,
  };

  const { data } = await axios(BASE_URL, { params });
  return data;
}
