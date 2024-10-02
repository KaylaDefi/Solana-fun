import ArtistProfileEdit from './ArtistProfileEdit'; 
import { getServerSession } from 'next-auth'; 
import { authOptions } from '../../auth/[...nextauth]/authOptions'; 
import Artist from '../../../../models/artist'; 
import { connectToDatabase } from '../../../../lib/db'; 

export async function getServerSideProps(context) {
  const { params } = context;
  const { id } = params; 

  await connectToDatabase();

  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session || !session.artistId) {
    return {
      redirect: {
        destination: '/artist/login',
        permanent: false,
      },
    };
  }

  const artist = await Artist.findById(id).lean();
  if (!artist) {
    return {
      notFound: true,
    };
  }

  return {
    props: { artist }, 
  };
}

export default async function Page({ params }) {
  const artistId = params.id;

  const artist = await fetchArtistData(artistId);

  if (!artist) {
    return <div>Artist not found</div>;
  }

  return <ArtistProfileEdit artist={artist} />;
}

async function fetchArtistData(id) {
  try {
    const res = await fetch(`/api/artist/${id}`, {
      method: 'GET',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch artist data');
    }

    const data = await res.json();
    return data.artist;
  } catch (error) {
    console.error('Error fetching artist data:', error);
    return null;
  }
}
