import SingleOutline from "@/components/outline/SingleOutline";


interface PageProps {
	params: Promise<{
		id: string
	}>;
}
const SingleOutlinePage = async ({
	params
}:
	PageProps
) => {
	const { id } = await params;
	return (
		<section><SingleOutline id={id} />
		</section>
	)
}

export default SingleOutlinePage