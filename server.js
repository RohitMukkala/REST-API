/**
 * BFHL API - Express implementation
 * Route: POST /bfhl
 * Returns: status, user_id, email, roll_number, odd_numbers, even_numbers,
 * alphabets (uppercased), special_characters, sum (as string),
 * concat_string (reverse order, alternating caps starting with Upper).
 */

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// === Customize these constants ===
const FULL_NAME = process.env.FULL_NAME || "john_doe";           // lowercase with underscore(s)
const DOB_DDMMYYYY = process.env.DOB_DDMMYYYY || "17091999";     // ddmmyyyy
const EMAIL = process.env.EMAIL || "john@xyz.com";
const ROLL_NUMBER = process.env.ROLL_NUMBER || "ABCD123";

function isDigitsOnly(str) {
  return typeof str === "string" && /^[0-9]+$/.test(str);
}

function isAlphaOnly(str) {
  return typeof str === "string" && /^[a-zA-Z]+$/.test(str);
}

function toBigIntSafe(numStr) {
  try {
    return BigInt(numStr);
  } catch (e) {
    // Fallback: treat as 0 if too big or invalid
    return BigInt(0);
  }
}

function alternatingCapsFromReversedLetters(letters) {
  // letters: array of single-letter strings in ORIGINAL order
  // We need: reverse overall order, then apply alternating caps starting Upper.
  const reversed = [...letters].reverse().join("");
  let out = "";
  for (let i = 0; i < reversed.length; i++) {
    const ch = reversed[i];
    if (/[a-zA-Z]/.test(ch)) {
      out += i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase();
    } else {
      out += ch;
    }
  }
  return out;
}

app.post("/bfhl", (req, res) => {
  try {
    const body = req.body || {};
    const arr = Array.isArray(body.data) ? body.data : null;

    if (!arr) {
      return res.status(200).json({
        is_success: false,
        user_id: `${String(FULL_NAME).toLowerCase()}_${DOB_DDMMYYYY}`,
        email: EMAIL,
        roll_number: ROLL_NUMBER,
        odd_numbers: [],
        even_numbers: [],
        alphabets: [],
        special_characters: [],
        sum: "0",
        concat_string: ""
      });
    }

    const odd_numbers = [];
    const even_numbers = [];
    const alphabets = [];
    const special_characters = [];

    let sum = BigInt(0);
    const letterStream = []; // for concat_string, keep per-character sequence from alphabetic items

    for (const item of arr) {
      const str = String(item);

      if (isDigitsOnly(str)) {
        // treat as number (keep as string in outputs)
        // Odd/Even
        const n = toBigIntSafe(str);
        if (n % BigInt(2) === BigInt(0)) {
          even_numbers.push(str);
        } else {
          odd_numbers.push(str);
        }
        sum += n;
      } else if (isAlphaOnly(str)) {
        // alphabets as full token uppercased
        alphabets.push(str.toUpperCase());
        // collect per-character original-case for alternating caps logic
        for (const ch of str) {
          letterStream.push(ch);
        }
      } else {
        // everything else -> special characters
        special_characters.push(str);
      }
    }

    const concat_string = alternatingCapsFromReversedLetters(letterStream);
    const response = {
      is_success: true,
      user_id: `${String(FULL_NAME).toLowerCase()}_${DOB_DDMMYYYY}`,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: String(sum),
      concat_string
    };

    return res.status(200).json(response);
  } catch (err) {
    return res.status(200).json({
      is_success: false,
      user_id: `${String(FULL_NAME).toLowerCase()}_${DOB_DDMMYYYY}`,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      odd_numbers: [],
      even_numbers: [],
      alphabets: [],
      special_characters: [],
      sum: "0",
      concat_string: ""
    });
  }
});

// Health check (optional)
app.get("/", (req, res) => {
  res.status(200).json({ status: "OK", route: "/bfhl", method: "POST" });
});

// Start server only when not running in serverless
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export the app for serverless adapters (Vercel @vercel/node)
module.exports = app;
