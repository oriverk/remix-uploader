import { Container } from "@/components/Container";
import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import markdown from "../docs/term-of-service.md?raw";
import { parseMarkdown } from "../utils/markdown";

export const loader = ({ params, request }: LoaderFunctionArgs) => {
	const html = parseMarkdown(markdown);
	return json({
		html,
	});
};

export default function Lorem() {
	const { html } = useLoaderData<typeof loader>();
	return (
		<article>
			<Container>
				<div
					className="prose mx-auto py-12 max-w-3xl lg:prose-lg"
					dangerouslySetInnerHTML={{ __html: html }}
				/>
			</Container>
		</article>
	);
}
