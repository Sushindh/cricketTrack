import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { addFavorite, removeFavorite } from "../services/api";

// PRO-TIP: Always make sure itemId and itemType are provided from the parent!
const FavoriteButton = ({ itemId, itemType, title, data, isFavorite, reloadFavorites }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Quick debug aid to make sure we never send undefined!
  const handleAdd = async () => {
    if (!itemId || !itemType) {
      alert("Error: itemId and itemType are required for adding favorite!");
      return;
    }
    // Optionally log this for debugging
    console.log("Adding favorite payload:", { itemId, itemType, title, data });
    setLoading(true);
    await addFavorite(user.id, {
      itemId,
      type: itemType,
      title: title || "",         // Fallback if title is not set
      data: data || {},
      createdAt: new Date()
    });
    setLoading(false);
    reloadFavorites && reloadFavorites();
  };

  const handleRemove = async () => {
    setLoading(true);
    await removeFavorite(user.id, itemId);
    setLoading(false);
    reloadFavorites && reloadFavorites();
  };

  return isFavorite ? (
    <button onClick={handleRemove} disabled={loading} className="px-4 py-2 bg-red-500 text-white rounded-full">
      Remove from Favorites
    </button>
  ) : (
    <button onClick={handleAdd} disabled={loading} className="px-4 py-2 bg-yellow-500 text-black rounded-full">
      Add to Favorites
    </button>
  );
};

export default FavoriteButton;
