import type { Metadata, ResolvingMetadata } from 'next';
import MenuLink from '@/components/server/menu-link';
import { weeks } from '@/utils/constants';

interface Props {
    params: {
        cycle: string;
    };
}

const generateMetadata = ({ params: { cycle } }: Props, parent: ResolvingMetadata): Metadata => ({
    title: `Cycle ${cycle}`,
    ...parent,
});

const CyclePage = ({ params: { cycle } }: Props) => (
    <div className="flex flex-col items-center py-16">
        <h3 className="pb-6">Please select a week 👇</h3>
        <div className="flex flex-row">
            {weeks.map((week) => (
                <MenuLink
                    className="bg-sky-500 rounded-md p-4 m-4"
                    key={`page-link-week-${week}`}
                    href={`/cycle/${cycle}/week/${week}`}
                >
                    Week {week}
                </MenuLink>
            ))}
        </div>
    </div>
);

export { generateMetadata };
export default CyclePage;
