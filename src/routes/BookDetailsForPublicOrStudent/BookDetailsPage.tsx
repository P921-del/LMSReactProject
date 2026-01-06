import { useParams } from "react-router";
import BookDetails from "../../Components/BookDetailsForPublicOrStudent/BookDetails";

function BookDetailsPage() {
  let { bookId } = useParams();
  return <BookDetails bookId={bookId} />;
}

export default BookDetailsPage;
