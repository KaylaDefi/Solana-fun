import Announcements from '../../../components/Artist/Announcements';
import Link from 'next/link';

const ArtistProfileView = ({ artist }) => {
  if (!artist) {
    return <div>Artist not found</div>;
  }

  return (
    <div className="container">
      <h1 className="text-3xl font-bold mb-6">{artist.name}</h1>
      <p className="mb-4"><strong>Bio:</strong> {artist.bio}</p>

      <Link href="/?page=donate" legacyBehavior>
        <a className="btn btn-primary mb-4">Donate</a>
      </Link>
      <Link href="/?page=upload-music" legacyBehavior>
        <a className="btn btn-secondary mb-4">Upload Music</a>
      </Link>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Announcements</h2>
        <Announcements />
      </div>

      {/* Add an option to update artist profile */}
      <Link href={`/artist/${artist._id}/edit`} legacyBehavior>
        <a className="btn btn-secondary mb-4">Update Artist Profile</a>
      </Link>
    </div>
  );
};

// Fetch artist data from an API or server-side
export async function getServerSideProps({ params }) {
  try {
    const res = await fetch(`http://localhost:5001/api/artist/${params.id}`);

    // Check if the response is OK (status code 200–299)
    if (!res.ok) {
      throw new Error(`Failed to fetch artist with ID: ${params.id}`);
    }

    // Parse the response as JSON
    const artist = await res.json();

    return { props: { artist } };
  } catch (error) {
    console.error('Error fetching artist:', error);

    // Return `artist: null` if there's an error
    return { props: { artist: null } };
  }
}


export default ArtistProfileView;
