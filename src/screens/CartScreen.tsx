import React from 'react'
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useStore } from '../store/store'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { COLORS, SPACING } from '../theme/theme'
import HeaderBar from '../components/HeaderBar'
import EmptyListAnimation from '../components/EmptyListAnimation'
import PaymentFooter from '../components/PaymentFooter'
import CardItem from '../components/CardItem'

const CartScreen = ({ navigation, route }: any) => {
  const CartList = useStore((state: any) => state.CartList)
  const CartPrice = useStore((state: any) => state.CartPrice);

  const incrementCartItemQuantity = useStore((state: any) => state.incrementCartItemQuantity);
  const decrementCartItemQuantity = useStore((state: any) => state.decrementCartItemQuantity);
  const calculateCartPrice = useStore((state: any) => state.calculateCartPrice);
  const tabBarHeight = useBottomTabBarHeight();


  const buttonPressHandler = () => {
    navigation.push('Payment');
  };

  const incrementCartItemQuantityHandler = (id: string, size: string) => {
    incrementCartItemQuantity(id, size);
    calculateCartPrice();
  };

  const decrementCartItemQuantityHandler = (id: string, size: string) => {
    decrementCartItemQuantity(id, size);
    calculateCartPrice();
  };



  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ScrollViewFlex}
      >
        <View
          style={[styles.ScrollViewInnerView, { marginBottom: tabBarHeight }]}>
          <View style={styles.ItemContainer}>
            <HeaderBar title='Cart ' />
            {CartList.length == 0 ?
              <EmptyListAnimation title='Cart is Empty' />
              :
              (<View style={styles.ListItemContainer}>
                {
                  CartList.map((data: any) => (
                    <TouchableOpacity onPress={() => {console.log(CartList) }} key={data.id}>
                      <CardItem
                        id={data.id}
                        name={data.name}
                        imagelink_square={data.imagelink_square}
                        special_ingredient={data.special_ingredient}
                        roasted={data.roasted}
                        prices={data.prices}
                        type={data.type}
                        incrementCartItemQuantityHandler={()=>{}}
                        decrementCartItemQuantityHandler={()=>{}}
                      />
                    </TouchableOpacity>
                  ))}
              </View>
              )}
          </View>
          {CartList.length != 0 ? <PaymentFooter buttonTitle='Pay' price={{ price: CartPrice, currency: '$' }} buttonPressHandler={() => { buttonPressHandler }} /> : <></>}
        </View>

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
  },
  ScrollViewFlex: {
    flexGrow: 1,
  },
  ScrollViewInnerView: {
    flex: 1,
    justifyContent: 'space-between',
  },
  ItemContainer: {
    flex: 1,
  },
  ListItemContainer: {
    paddingHorizontal: SPACING.space_20,
    gap: SPACING.space_20,
  },
});

export default CartScreen;