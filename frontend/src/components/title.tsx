import Head from 'next/head';

interface Props {
    title?: string;
}

const Title = ({ title = '5/3/1' }: Props) => (
    <Head>
        <title>{title}</title>
    </Head>
);

export default Title;
