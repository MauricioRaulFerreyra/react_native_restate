import { Card, FeaturedCard } from "@/components/Cards";
import Filters from "@/components/Filters";
import NoResults from "@/components/NoResults";
import Search from "@/components/Search";
import icons from "@/constants/icons";
import { getLatestProperties, getProperties } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";
import { useAppwrite } from "@/lib/useAppwrite";
import { router, useLocalSearchParams } from "expo-router";
import { Fragment, useEffect } from "react";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {

  const { user } = useGlobalContext();

  const params = useLocalSearchParams<{query?:string, filter?:string}>();

  const {data: latesProperties, loading:latesPropertiesLoading} = useAppwrite({fn:getLatestProperties});

  const { data: properties, loading, refetch } = useAppwrite({
    fn: getProperties,
    params:{
      filter: params.filter!,
      query: params.query!,
      limit: 6
    },
    skip: true
  });

  useEffect(()=>{
    refetch({
      filter: params.filter!,
      query: params.query!,
      limit: 6
    });
  },[params.filter,params.query]);

  const handleCardPress = (id: string) => router.push(`/properties/${id}`);

  return (
    <SafeAreaView className="h-full bg-white">
      <FlatList 
        data={properties}
        renderItem={({item}) => <Card item={item} onPress={()=>handleCardPress(item.$id)} />}
        keyExtractor={(item) => item.$id}
        numColumns={2}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-4 px-4"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size='large' className="text-primary-300 mt-5"/>
          ) : <NoResults/> 
        }
        ListHeaderComponent={
          <Fragment>
            <View className="px-5">        
              <View className="flex flex-row items-center justify-between mt-4">
                <View className="flex flex-row items-center">
                  <Image source={{uri: user?.avatar}} className="size-12 rounded-full"/>
                  <View className="flex flex-col items-start ml-2 justify-center">
                    <Text className="text-xs font-rubik text-black-100"> Good Moornig</Text>
                    <Text className="text-base font-rubik-medium text-black-300">{user?.name}</Text>
                  </View>
                </View>
                <Image source={icons.bell} className="size-6" />
              </View>        
            </View>
            <Search/>
            <View className="px-5">
              <View className="flex flex-row items-center justify-between my-2">
                <Text className="text-xl font-rubik-bold text-black-300">Featured</Text>
                <TouchableOpacity>
                  <Text className="text-base font-rubik-bold text-primary-300">See All</Text>
                </TouchableOpacity>
              </View>
                {/* FeaturedCard  */}
              {latesPropertiesLoading ? (
                <ActivityIndicator size="large" className="text-primary-300" />
              ) : !latesProperties || latesProperties.length === 0 ? (
                <NoResults />
              ) : (
                <FlatList
                  data={latesProperties}
                  renderItem={({ item }) => (
                    <FeaturedCard
                      item={item}
                      onPress={() => handleCardPress(item.$id)}
                    />
                  )}
                  keyExtractor={(item) => item.$id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerClassName="flex gap-5 mt-5"
                />
              )}
            </View>
             {/* <Button title="seed" onPress={seed} /> */}
            <View className="flex flex-row items-center justify-between mt-3 mx-5">
              <Text className="text-xl font-rubik-bold text-black-300">Our Recommendation</Text>
              <TouchableOpacity>
                <Text className="text-base font-rubik-bold text-primary-300">See All</Text>
              </TouchableOpacity>
            </View>
            <Filters/>         
          </Fragment>
        }
      />
    </SafeAreaView>
  );
};

export default Home;