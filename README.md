# BFHL API (Express)

**Route:** `POST /bfhl`  
**Status code:** `200` on success  
**Stack:** Node.js + Express  
**Hosting:** Works on Vercel (via `@vercel/node`) or Render/Railway/Heroku.

## Customize required fields
Set these (env vars) to match the problem statement:
- `FULL_NAME` (lowercase with underscores, e.g. `john_doe`)
- `DOB_DDMMYYYY` (e.g. `17091999`)
- `EMAIL` (e.g. `john@xyz.com`)
- `ROLL_NUMBER` (e.g. `ABCD123`)

The API returns `user_id` in the format `<full_name>_<ddmmyyyy>`, e.g. `john_doe_17091999`.

## Run locally
```bash
npm install
npm start
# POST http://localhost:3000/bfhl
```

## Deploy to Vercel
```bash
# Install vercel CLI if needed
npm i -g vercel

# Set env vars (example)
vercel env add FULL_NAME
vercel env add DOB_DDMMYYYY
vercel env add EMAIL
vercel env add ROLL_NUMBER

# Deploy
vercel --prod
```

## Deploy to Render
1. Create a new **Web Service**, connect the GitHub repo.
2. Build Command: `npm install`
3. Start Command: `npm start`
4. Add environment variables (`FULL_NAME`, `DOB_DDMMYYYY`, `EMAIL`, `ROLL_NUMBER`).
5. After deploy, your endpoint will be: `https://<your-service>.onrender.com/bfhl`

## Request format
```json
{
  "data": ["a","1","334","4","R","$"]
}
```

## Sample responses (match the question paper)

- Example A input: `{"data":["a","1","334","4","R","$"]}`  
  Output (using defaults):  
  ```json
  {
    "is_success": true,
    "user_id": "john_doe_17091999",
    "email": "john@xyz.com",
    "roll_number": "ABCD123",
    "odd_numbers": ["1"],
    "even_numbers": ["334","4"],
    "alphabets": ["A","R"],
    "special_characters": ["$"],
    "sum": "339",
    "concat_string": "Ra"
  }
  ```

- Example B input: `{"data":["2","a","y","4","&","-","*","5","92","b"]}`  
  Output:  
  ```json
  {
    "is_success": true,
    "user_id": "john_doe_17091999",
    "email": "john@xyz.com",
    "roll_number": "ABCD123",
    "odd_numbers": ["5"],
    "even_numbers": ["2","4","92"],
    "alphabets": ["A","Y","B"],
    "special_characters": ["&","-","*"],
    "sum": "103",
    "concat_string": "ByA"
  }
  ```

- Example C input: `{"data": ["A","ABcD","DOE"]}`  
  Output:  
  ```json
  {
    "is_success": true,
    "user_id": "john_doe_17091999",
    "email": "john@xyz.com",
    "roll_number": "ABCD123",
    "odd_numbers": [],
    "even_numbers": [],
    "alphabets": ["A","ABCD","DOE"],
    "special_characters": [],
    "sum": "0",
    "concat_string": "EoDdCbAa"
  }
  ```

## Notes
- Numbers are treated as **strings** in the response (per requirement).
- Non-digit / non-alpha tokens are returned as `special_characters`.
- `concat_string` is built from **all alphabetic characters**, reversed, with **alternating caps** starting **Upper**.
