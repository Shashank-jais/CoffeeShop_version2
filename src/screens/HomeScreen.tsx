import React, { useRef, useState } from 'react'
import { Dimensions, ScrollView, StatusBar, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import { useStore } from '../store/store'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme'
import HeaderBar from '../components/HeaderBar'
import CustomIcon from '../components/CustomIcon'
import { FlatList } from 'react-native'
import CoffeeCard from '../components/CoffeeCard'

const getCategoriesromData = (data: any) => {
  let temp: any = {}
  for (let i = 0; i < data.length; i++) {
    if (temp[data[i].name] == undefined) {
      temp[data[i].name] = 1;
    } else {
      temp[data[i].name]++;
    }
  }
  let categories = Object.keys(temp);
  categories.unshift('All');
  return categories;
}

const getCoffeeList = (category: string, data: any) => {
  if (category == 'All') {
    return data;
  }
  else {
    let coffeelist = data.filter((item: any) => item.name == category);
    return coffeelist;
  }
}


const HomeScreen = ({ navigation }: any) => {
  const CoffeList = useStore((state: any) => state.CoffeeList)
  const BeanList = useStore((state: any) => state.BeanList)
  // console.log(CoffeList)

  const [categories, setCategories] = useState(getCategoriesromData(CoffeList))
  const [searchText, setSearchText] = useState('')
  const [categoryIndex, setCategoryIndex] = useState({
    index: 0,
    category: categories[0],
  })

  const [sortedCofee, setSortedCofee] = useState(
    getCoffeeList(categoryIndex.category, CoffeList)
  );


  const ListRef: any = useRef<FlatList>();
  const tabBarHeight = useBottomTabBarHeight();


  const SearchCoffe = (search: string) => {
    if (search != '') {
      ListRef?.current?.scrollToOffset({
        animated: true,
        offset: 0,
      });
      setCategoryIndex({ index: 0, category: categories[0] });
      setSortedCofee([
        ...CoffeList.filter((item: any) =>
          item.name.toLowerCase().includes(search.toLowerCase()),
        ),
      ]);
    }
  };


  const resetSearchCoffee = () => {
    ListRef?.current?.scrollToOffset({
      animated: true,
      offset: 0,
    });

    setCategoryIndex({ index: 0, category: categories[0] })
    setSortedCofee([...CoffeList])
    setSearchText('')

  }

  const addToCart = useStore((state: any) => state.addToCart);
  const calculateCartPrice = useStore((state: any) => state.calculateCartPrice);


  const CoffeCardAddToCart = ({
    id,
    index,
    name,
    roasted,
    imagelink_square,
    special_ingredient,
    type,
    prices,
  }: any) => {
    addToCart({
      id,
      index,
      name,
      roasted,
      imagelink_square,
      special_ingredient,
      type,
      prices,
    });
    calculateCartPrice();
    ToastAndroid.showWithGravity(
      `${name} is Added to Cart`,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };


  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />
      <ScrollView
        showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewFlex}
      >
        {/* header */}
        <HeaderBar />

        <Text style={styles.ScreenTitle}>Find the best{'\n'}coffee for you</Text>


        {/* seacrch input */}
        <View style={styles.InputContainerComponent}>
          <TouchableOpacity

            onPress={() => {
              SearchCoffe(searchText);
            }}
          >
            <CustomIcon
              style={styles.InputIcon}
              name='search'
              size={FONTSIZE.size_18}
              color={searchText.length > 0 ? COLORS.primaryOrangeHex : COLORS.primaryLightGreyHex} />

          </TouchableOpacity>
          <TextInput
            placeholder='Find you coffee...'
            value={searchText}
            style={styles.seachtext}
            onChangeText={text => {
              setSearchText(text);
              SearchCoffe(text);
            }}
            placeholderTextColor={COLORS.primaryLightGreyHex}
          />
          {searchText.length > 0 ? (<TouchableOpacity onPress={() => { resetSearchCoffee() }}><CustomIcon
            style={styles.InputIcon}
            name='close'
            size={FONTSIZE.size_18}
            color={COLORS.primaryLightGreyHex} />
          </TouchableOpacity>) : (<></>)}
        </View>


        {/* Category Scroller */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryscrollView}>
          {categories.map((data, index) => (
            <View
              key={index.toString()}
              style={styles.categoryscrollViewController}
            >
              <TouchableOpacity
                style={styles.categoryscrollViewItem}
                onPress={() => {
                  ListRef?.current?.scrollToOffset({
                    animated: true,
                    offset: 0,
                  })
                  setCategoryIndex({ index: index, category: categories[index] });
                  setSortedCofee([...getCoffeeList(categories[index], CoffeList)])
                }}
              >
                <Text
                  style={[styles.CategoryText,
                  categoryIndex.index == index ? { color: COLORS.primaryOrangeHex } : {}
                  ]}
                >
                  {data}
                </Text>
                {categoryIndex.index == index ? <View style={styles.ActiveCategory} /> : <></>}
              </TouchableOpacity>
            </View>
          ))
          }



        </ScrollView>


        {/* CoffeeList */}
        <FlatList
          ref={ListRef}
          horizontal
          ListEmptyComponent={<View style={styles.emptylistconatiner}>
            <Text style={styles.CategoryText}>No Coffee found</Text>
          </View>}
          showsHorizontalScrollIndicator={false}
          data={sortedCofee}
          contentContainerStyle={styles.FlatListContainer}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            return <TouchableOpacity onPress={() => {
              navigation.push("Details", { index: item.index, id: item.id, type: item.type })
            }}>
              <CoffeeCard
                id={item.id}
                index={item.index}
                type={item.type}
                roasted={item.roasted}
                imagelink_square={item.imagelink_square}
                name={item.name}
                special_ingredient={item.special_ingredient}
                average_rating={item.average_rating}
                price={item.prices[2]}
                buttonPressHandler={CoffeCardAddToCart}
              />
            </TouchableOpacity>;
          }}
        >

        </FlatList>


        {/* BeanList */}
        <Text style={styles.CoffeeBeansTitle}>Coffee Beans</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={BeanList}
          contentContainerStyle={[styles.FlatListContainer, { marginBottom: tabBarHeight }]}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            return <TouchableOpacity onPress={() => {
              navigation.push("Details", { index: item.index, id: item.id, type: item.type });
            }}>
              <CoffeeCard
                id={item.id}
                index={item.index}
                type={item.type}
                roasted={item.roasted}
                imagelink_square={item.imagelink_square}
                name={item.name}
                special_ingredient={item.special_ingredient}
                average_rating={item.average_rating}
                price={item.prices[2]}
                buttonPressHandler={CoffeCardAddToCart}
              />
            </TouchableOpacity>;
          }}
        >

        </FlatList>

      </ScrollView>
    </View >
  )
}


const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
  },
  scrollViewFlex: {
    flexGrow: 1,
  },
  ScreenTitle: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_28,
    color: COLORS.primaryWhiteHex,
    paddingLeft: SPACING.space_30,
  },
  InputContainerComponent: {
    flexDirection: 'row',
    margin: SPACING.space_30,
    borderRadius: BORDERRADIUS.radius_20,
    backgroundColor: COLORS.primaryDarkGreyHex,
    alignItems: 'center'
  },
  InputIcon: {
    marginHorizontal: SPACING.space_20,

  },
  seachtext: {
    flex: 1,
    height: SPACING.space_20 * 3,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryWhiteHex
  },
  categoryscrollView: {
    paddingHorizontal: SPACING.space_20,
    marginBottom: SPACING.space_20,

  },
  categoryscrollViewController: {
    paddingHorizontal: SPACING.space_15,

  },
  categoryscrollViewItem: {
    alignItems: 'center'
  },
  CategoryText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryLightGreyHex,
    marginBottom: SPACING.space_4,
  },
  ActiveCategory: {
    height: SPACING.space_10,
    width: SPACING.space_10,
    borderRadius: BORDERRADIUS.radius_10,
    backgroundColor: COLORS.primaryOrangeHex,
  },
  FlatListContainer: {
    gap: SPACING.space_20,
    paddingVertical: SPACING.space_20,
    paddingHorizontal: SPACING.space_30,

  },
  CoffeeBeansTitle: {
    fontSize: FONTSIZE.size_18,
    marginLeft: SPACING.space_30,
    marginTop: SPACING.space_20,
    fontFamily: FONTFAMILY.poppins_medium,
    color: COLORS.secondaryLightGreyHex,
  },
  emptylistconatiner: {
    width: Dimensions.get('window').width - SPACING.space_30 * 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.space_36 * 3.6,
  }

})
export default HomeScreen