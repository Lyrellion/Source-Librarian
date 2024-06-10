# Source Librarian
A discord bot for the Ars Nouveau discord

## Dev
- Copy `.dev.env` to `.env` and populate with the corresponding values.

- To run the bot use `npm run start`
- New features should be created in `./src/features` and should export a default `Handler`.
  - Commands and events can be registered inside a feature. Check out the Handler type for more information.
