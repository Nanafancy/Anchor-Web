import { ContentContainer } from "@/components/layouts/ContentContainer";
import Overview from "@/components/dashboard/Overview";

export default function Home() {
	return (
		<div className="space-y-6">
			<ContentContainer>
				<Overview />
			</ContentContainer>
		</div>
	);
}
