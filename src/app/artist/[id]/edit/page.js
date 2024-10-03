import ArtistProfileEdit from './ArtistProfileEdit'; 
import { getServerSession } from 'next-auth'; 
import { authOptions } from '../../../api/auth/[...nextauth]/authOptions'; 
import Artist from '../../../../models/artist'; 
import { connectToDatabase } from '../../../../lib/db'; 

export default async function Page({ params }) {
  const artistId = params.id;

  await connectToDatabase();

  const session = await getServerSession(authOptions);
  if (!session || session.artistId !== artistId) {
    return <div>You are not authorized to edit this profile.</div>;
  }

  const artist = await Artist.findById(artistId).lean();
  if (!artist) {
    return <div>Artist not found</div>;
  }

  return <ArtistProfileEdit artist={artist} />;
}
