import type { Metadata, ResolvingMetadata } from 'next';
import { weeks } from '@utils/constants';
import MenuLink from '@components/menu-link';

interface CyclePageProps {
    params: {
        cycle: string;
    };
}

const generateMetadata = ({ params }: CyclePageProps, parent: ResolvingMetadata): Metadata => ({
    title: `Cycle ${params.cycle}`,
    ...parent,
});

const CyclePage = ({ params }: CyclePageProps) => (
    <div className="flex flex-col items-center py-16">
        <h3 className="pb-6">Please select a week 👇</h3>
        <div className="flex flex-row">
            {weeks.map((week) => (
                <MenuLink
                    className="bg-sky-500 rounded-md p-4 m-4"
                    key={`page-link-week-${week}`}
                    href={`/cycle/${params.cycle}/week/${week}`}
                >
                    Week {week}
                </MenuLink>
            ))}
        </div>
    </div>
);

export { generateMetadata };
export default CyclePage;
