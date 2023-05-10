"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const setting_1 = require("./setting");
const db_1 = require("./repositories/db");
const port = process.env.PORT || 3000;
(0, db_1.runDb)();
setting_1.app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
