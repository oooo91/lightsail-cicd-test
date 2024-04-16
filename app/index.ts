import * as redis from "redis"
import { createApp } from "./app";
import dotenv from "dotenv";

dotenv.config();

/**
 * 이 부분은 실제 서버가 실행되는 곳
 */

const { PORT, REDIS_URL } = process.env;

if (!PORT) throw new Error("PORT is required");
if (!REDIS_URL) throw new Error("REDIS_URL is required");

const startServer = async () => {
    console.log("trying to start server");
    const client = redis.createClient({url:REDIS_URL});
    await client.connect(); //Promise 를 리턴하므로 await 해야한다. top level 에서는 await 사용할 수 없으므로 함수로 감싸준다.

    const app = createApp(client);
    app.listen(PORT, () => {
        console.log(`App Listening at Port ${PORT}`);
    });
};

startServer();
