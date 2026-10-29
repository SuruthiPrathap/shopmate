import {Laptop,Shirt,Sofa,Sparkles,Dumbbell}from "lucide-react";
const categories = [
    { id: 1, name: "Electronics", icon: <Laptop size={28} /> },
  { id: 2, name: "Fashion", icon: <Shirt size={28} /> },
  { id: 3, name: "Home & Living", icon: <Sofa size={28} /> },
  {id:4,name:"Beauty",icon:<Sparkles size={28}/>},
  {id:5,name:"Sports",icon:<Dumbbell size={28}/>},

];

function Categories() {
  return (
    <section className="categories">
      <h2>Shop by Category</h2>

      <div className="categories-list">
        {categories.map((category) => (
          <div className="category-card" key={category.id}>
            <div className="category-icon">{category.icon}</div>
            <p>{category.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Categories;