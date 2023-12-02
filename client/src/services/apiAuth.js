import customFetch from '../utils/customFetch';

export async function signup(userData) {
  const { data, error } = await customFetch.post('/users/signUp', userData);

  if (error) throw new Error(error.message);

  return data;
}

export async function login({ email, password }) {
  const { data, error } = await customFetch.post('/users/login', {
    email,
    password,
  });

  if (error) throw new Error(error.message);

  return data;
}

export async function getCurrentUser() {
  const { data, error } = await customFetch.get('/users/me');

  if (error) throw new Error(error.message);

  return data.data;
}

export async function logout() {
  const { error } = await customFetch.get('/users/logout');

  if (error) throw new Error(error.message);
}

export async function updateCurrentUser({ password, name, avatar }) {
  let query;
  const form = new FormData();

  // 1) Update name OR avatar
  if (avatar && name) {
    form.append('avatar', avatar);
    form.append('name', name);
    query = customFetch.patch('/users/updateMe', form);
  }

  if (name && !avatar) {
    form.append('name', name);
    query = customFetch.patch('/users/updateMe', form);
  }

  // 2) Update password
  if (password) query = customFetch.patch('/users/updateMyPassword', password);

  const { data, error } = await query;
  console.log(data);
  if (error) throw new Error(error.message);

  return data;
}
