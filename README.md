
# Frontend Sistem Manajemen Work Order

It's only for Frontend for Sistem Manajemen Work Order.




## Run Locally

Clone the project

```bash
  git clone https://github.com/vinss-droid/fe-smwom.git
```

Go to the project directory

```bash
  cd fe-smwom
```

Install dependencies

```bash
  npm install
```

Copy .env.example to .env

```bash
  cp .env.example .env
```

Set base backend api url in .env file (make sure you have start the backend first.)

.env

`NEXT_PUBLIC_API_BASE_URL=`

example:

`NEXT_PUBLIC_API_BASE_URL="http://127.0.0.1:8000/api"`

Start the server

```bash
  npm run dev
```


## Default Account

| Email | Password     | Role                |
| :-------- | :------- | :------------------------- |
| `pm@smwom.com` | `pm@smwom.com` | Production Manager |
| `op1@smwom.com` | `op1@smwom.com` | Operator |
| `op2@smwom.com` | `op2@smwom.com` | Operator |



## Tech Stack

**Framework:** React, NextJS

**UI:** TailwindCSS, HeroUI

