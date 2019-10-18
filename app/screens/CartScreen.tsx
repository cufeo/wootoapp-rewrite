import { Attribute, Product, Variation } from "../types/woocommerce";
import { Icon, Image, ListItem, withTheme } from "react-native-elements";
import { Dimensions, SafeAreaView, ScrollView, View } from "react-native";
import { ICart, ICartLineItem } from "../reducers/cart";

import Text from "../primitives/Text";
import Actions from "../actions";
import CartLineItem, { CART_CARD_HORIZONTAL_PADDING } from "../components/CartLineItem";
import Button from "../components/Button";
import React from "react";
import { connect } from "react-redux";
import FooterNavigationArea from "../components/FooterNavigationArea";
import { rules } from "../styles";
import Price from "../components/Price";

export interface ICartScreenProps {
	navigation: {
		state: {
			params: {
				product: Product;
			};
		};
	};

	cart: ICart;
	goBack: () => void;
}

export interface ICartScreenState {}

const SubtotalLineItem = connect(
	(store, ownProps) => {
		return { cart: store.cart };
	},
	dispatch => {
		return {};
	}
)(
	withTheme(props => {
		let total = 0;
		const { theme, cart } = props;

		cart.lineItems.map((li: ICartLineItem) => {
			total += li.totalLine;
		});
		return (
			<ListItem
				containerStyle={{ backgroundColor: theme.colors.backgroundColor }}
				title={
					<View style={{ paddingHorizontal: CART_CARD_HORIZONTAL_PADDING }}>
						<Text h4>Subtotal</Text>
					</View>
				}
				rightTitle={
					<Text style={{ paddingHorizontal: CART_CARD_HORIZONTAL_PADDING }}>
						<Price price={total} />
					</Text>
				}
			/>
		);
	})
);

class CartScreen extends React.Component<ICartScreenProps, ICartScreenState> {
	state = {};

	static navigationOptions = ({ navigation, navigationOptions }) => {
		return {
			title: "View Cart",
			backButton: true,
		};
	};

	constructor(props: ICartScreenProps) {
		super(props);
	}

	navigateToCheckout = () => {
		this.props.navigation.navigate("Checkout");
	};

	render() {
		const { height } = Dimensions.get("window");
		const { cart, theme } = this.props;

		const effectiveHeight = height - rules.headerHeight;
		return (
			<View
				accessibilityLabel={"cartScreenBaseView"}
				style={{
					flex: 1,
					height: effectiveHeight,
					flexDirection: "column",
					backgroundColor: theme.colors.backgroundColor,
				}}
			>
				<ScrollView style={{ flex: 1 }}>
					{cart.lineItems.map((li: ICartLineItem) => {
						return <CartLineItem lineItem={li} />;
					})}

					<SubtotalLineItem />
				</ScrollView>
				<View>
					<FooterNavigationArea>
						<Button title="Proceed to Checkout" onPress={this.navigateToCheckout} style={{ flex: 1 }} />
					</FooterNavigationArea>
				</View>
			</View>
		);
	}
}

const select = (store, ownProps: ICartScreenProps) => {
	return {
		cart: store.cart,
	};
};

const actions = dispatch => {
	const {} = Actions;
	return {};
};

export default connect(
	select,
	actions
)(withTheme(CartScreen));
