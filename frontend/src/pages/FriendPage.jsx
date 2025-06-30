import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getUserFriends } from "../lib/api";
import { Link } from "react-router";
import { UserIcon, Users, Heart } from "lucide-react";
import FriendCard from "../components/FriendCard";

const FriendPage = () => {
  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your Friends
          </h2>
          <Link to="/notifications" className="btn btn-outline btn-sm">
            <UserIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
        </div>
        
        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : friends.length === 0 ? (
          <div className="card bg-base-200 p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Users className="size-16 text-base-content opacity-40" />
                <Heart className="size-6 text-red-400 absolute -top-2 -right-2" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-base-content">
              No friends yet!
            </h3>
            <p className="text-base-content opacity-70 mb-6 max-w-md mx-auto">
              Start building your language learning community by connecting with fellow learners. 
              Find your perfect language exchange partner today!
            </p>
            <div className="space-y-3">
              <Link to="/" className="btn btn-primary">
                <Users className="mr-2 size-4" />
                Discover Language Partners
              </Link>
              <Link to="/notifications" className="btn btn-outline btn-sm">
                <UserIcon className="mr-2 size-4" />
                Check Friend Requests
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendPage;