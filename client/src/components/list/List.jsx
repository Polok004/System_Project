import "./list.scss";
import Card from "../card/Card";

function List({ posts, currentUser, onDelete }) {
  return (
    <div className="list">
      {posts.map((item) => (
        <Card
          key={item.id}
          item={item}
          currentUser={currentUser}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default List;
