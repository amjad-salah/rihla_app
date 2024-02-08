import asyncHandler from 'express-async-handler';
import Company from '../models/companyModel.js';

//@desc Get All Companies
//@rotue  GET /api/companies
//@access Private
const getAllCompanies = asyncHandler(async (req, res) => {
  const companies = await Company.find().sort('-createdAt');
  res.status(200).json({ companies });
});

//@desc Get Single Company
//@rotue  GET /api/companies/:id
//@access Private
const getCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) {
    res.status(404);
    throw new Error('Company Not Found');
  }
  res.status(200).json({ company });
});

//@desc Create Company
//@rotue  POST /api/companies
//@access Private
const createCompany = asyncHandler(async (req, res) => {
  const companies = await Company.find();

  if (companies.length) {
    res.status(400);
    throw new Error('There is one company found! you can not add another');
  }
  const { name, address, phoneNumber } = req.body;

  if (!name || !phoneNumber || !address) {
    res.status(400);
    throw new Error('All fields are required');
  }

  const newCompany = await Company.create(req.body);

  res.status(201).json({ newCompany });
});

//@desc Update Company
//@rotue  PUT /api/companies/:id
//@access Private
const updateCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);

  if (!company) {
    res.status(404);
    throw new Error('Company Not Found');
  }

  const updatedCompany = await Company.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  res.status(200).json({ updatedCompany });
});

//@desc Delete Company
//@rotue  Delete /api/companies/:id
//@access Private
const deleteCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);

  if (!company) {
    res.status(404);
    throw new Error('Company Not Found');
  }

  await Company.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: 'Company deleted successfully!' });
});

export {
  getAllCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
};
