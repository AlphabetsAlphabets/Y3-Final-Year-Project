Note that there are two important branches in the repository ([link here](https://github.com/AlphabetsAlphabets/Y3-Final-Year-Project/tree/master)):
1. master ([link here](https://github.com/AlphabetsAlphabets/Y3-Final-Year-Project/tree/master))

If you wish to run the application locally for whatever reason, it can only be done here. This branch is meant for local testing.

2. 4-9-vercel ([link here](https://github.com/AlphabetsAlphabets/Y3-Final-Year-Project/tree/4-9-vercel))

This is the deployed/production version and is used by users ([link to deployed version here](https://y3-final-year-project.vercel.app/home)). The code contained in here will modify behaviour of the app and as a result the application **WILL NOT RUN** locally, and can only be ran if it is hosted. This is due to a lack of an SSL cert to enforce HTTPS when ran locally. For testing purposes, make sure to run the code in the master branch.

# Run instructions
This is how you can actually run the application locally:
1. Have `node` and `npm`.
2. Run `npm install` in the project root.
3. `npm run dev` to start dev environment.

To use the deployed version please click [here](https://y3-final-year-project.vercel.app/home)
