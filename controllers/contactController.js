import Contact from '../models/contactModel.js';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from './handleFactory.js';

export const getAllContacts = getAll(Contact);
export const getContact = getOne(Contact);
export const createContact = createOne(Contact);
export const updateContact = updateOne(Contact);
export const deleteContact = deleteOne(Contact);
