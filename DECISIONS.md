# DECISIONS

Keep this under 300 words.

- How you handled out-of-order API responses:

> I used a latestFetchKey counter to track API requests. Only the response matching the latest key updates the state, preventing stale data from overwriting newer fetches.

- One trade-off you made:

> I applied optimistic updates for create, update, and delete operations to provide immediate UI feedback. The trade-off is that temporary changes may appear before confirmation from the server, requiring rollback on failure.


- One improvement if you had more time:

> I would enhance accessibility with full screen-reader announcements and better focus management, and add per-operation loading indicators for more precise user feedback.


> **Note:**  
> I've also added a [Notion document](https://irradiated-sovereign-090.notion.site/Veronika-Vierna-Front-End-Developer-28ca8e7360d680f2b612ce367ed177eb) with a detailed description of the test assessment for your convenience.
