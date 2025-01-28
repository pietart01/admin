import { sign } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { executeQuery } from '@/lib/db';
import axios from "axios";
import {post} from "../../../lib/api/methods";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;
    const data = await post('admin/auth/login', {username, password});
/*
    const url = 'http://178.128.17.145:3010/admin/auth/login'; // Replace with your endpoint

    const response = await axios.post(url, {
      username,
      password
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const {data} = response;
    console.log('data', JSON.stringify(data));
*/

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
