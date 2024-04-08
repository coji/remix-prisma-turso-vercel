import { ActionFunctionArgs, json, type MetaFunction } from "@remix-run/node";
import { useActionData, useLoaderData, Form } from "@remix-run/react";
import { prisma } from "~/prisma.server";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async () => {
  const posts = await prisma.post.findMany({
    where: { published: true },
    take: 10,
  });
  return json({ posts });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const post = await prisma.post.create({
    data: { title, content, published: true },
  });
  return json({ post });
};

export default function Index() {
  const { posts } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix</h1>

      <Form method="post">
        <input type="text" name="title" placeholder="Title" />
        <textarea
          name="content"
          placeholder="Content"
          style={{
            display: "block",
          }}
        />
        <button type="submit">Create Post</button>
      </Form>

      {actionData?.post && (
        <div>
          <div>Post created!</div>
          <h2>{actionData.post.title}</h2>
          <p>{actionData.post.content}</p>
        </div>
      )}

      <ul>
        {posts.length === 0 && <li>No posts found.</li>}
        {posts.map((post) => {
          return (
            <li key={post.id}>
              <h2>{post.title}</h2>
              <p>{post.content}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
