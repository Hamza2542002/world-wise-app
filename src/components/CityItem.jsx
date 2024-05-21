import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";
import { useCities } from "../context/CitiesContext";
import Spinner from "./Spinner";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

function CityItem({ city }) {
  const { currentCity, deleteCity, isLoading } = useCities();
  const { id, cityName, date, position } = city;

  async function handleClick(e) {
    e.preventDefault();
    await deleteCity(cityName);
  }

  if (isLoading) return <Spinner />;

  return (
    <li>
      <Link
        to={`${cityName}?lat=${position.lat}&lng=${position.lng}`}
        className={`${styles.cityItem}  ${
          id === currentCity.id ? styles.cityItemactive : ""
        }`}
      >
        {/* <p className={styles.emoji}>{emoji}</p> */}
        <h3 className={styles.name}>{cityName}</h3>
        <p className={styles.date}>({formatDate(date)})</p>
        <button className={styles.deleteBtn} onClick={handleClick}>
          &times;
        </button>
      </Link>
    </li>
  );
}

export default CityItem;
