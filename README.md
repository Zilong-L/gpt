This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# Prerequisites
## Node version

make sure Node version is 18.x, run:
    
    node -v

I get result of v18.15.0, I've tested that 16.x doesn't work. So the docker runs in v18.

## API Key env file
create a .env.local file in the root directory, and add the following line:
    
    GPT_API_KEY="sk-xxxxxxxxxxxxxxx"

# Get Started
## Development
run npm i and wait for modules to install.

    npm i
then run npm run to start the dev server.
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment


~~  I failed to build a docker image to serve this app. If you can accomplish that, hope you can give me a hand.  ~~

Run this command to set up a docker image and run it.

    docker-compose up --build -d

## Deploy all in one script
If you have a empty server, run these command to start a website.

    cd gpt
    sudo chmod +x ./setup.bash
    ./setup.bash





