import request from "supertest";
import { LIST_KEY, RedisClient, createApp } from "./app";
import { App } from "supertest/types";
import * as redis from "redis"

let app: App;
let client: RedisClient;

beforeAll(async () => {
    client = redis.createClient({url:"redis://:test_env@localhost:6380"});
    await client.connect();
    app = createApp(client) as App;
});

beforeEach(async () => {
    await client.flushDb(); //redis 초기화
})

afterAll(async () => {
    await client.flushDb();
    await client.quit(); //커넥션 종료
})


describe("POST /messages", () => {
    it("responds with a success message", async () => {
        const response = await request(app)
            .post("/messages")
            .send({ message: "testing with redis" });

        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("Message added to list");
    });
});


describe("GET /messages", () => {
    it("responds with all messages", async () => {
        await client.lPush(LIST_KEY, ["msg1", "msg2"]); //한 번에 두 데이터 넣기
        const response = await request(app).get("/messages");

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(["msg2", "msg1"]);
    })
})