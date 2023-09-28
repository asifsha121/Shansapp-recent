import React, { useEffect, useState } from "react";
import { StyleSheet, View, TouchableWithoutFeedback, Text, FlatList } from "react-native";
import { Searchbar, ActivityIndicator } from "react-native-paper";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import { baseUrl } from "../../api/const";
import ProductList from "../productList";
import GoBack from "../NavGoBack/GoBack";

const searchUrl = `${baseUrl}/viewProducts?product_name=`;

const ProductScreen = () => {

    const [offset, setOffset] = useState(0);
    const [loadingMore, setLoadingMore] = useState(false);
    const [productNames, setProductNames] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);


    const renderLoader = () => {
        if (!loadingMore) {
            return null; // Hide the loader when not loading more
        }

        return (
            <View style={styles.loaderStyle}>
                <ActivityIndicator size="large" color="#ffa600" />
            </View>
        );
    };


    const loadMoreItem = () => {
        console.log("y first u load : ", loadingMore)
        if (loadingMore) return; // Prevent multiple calls while loading
        setLoadingMore(true);
        setOffset(offset + 1);
    };

    console.log("offset:", offset)

    const route = useRoute()

    const contact = route.params?.contact // without ? getting errors 
    const category = route.params?.category;
    console.log("route---:", route)
    // const{ contact }=route.params;


    const numColumns = 2;
    const navigation = useNavigation();

    const productUrl = category
        ? `${baseUrl}/viewProducts?category_id=${category}`
        : `${baseUrl}/viewProducts`;




    useEffect(() => {
        fetchProducts()
    }, [offset])

    

    const fetchProducts = () => {
        const apiUrl = category
            ? `${productUrl}&offset=${offset}&limit=20`
            : `${productUrl}?offset=${offset}&limit=20`;
    
        axios
            .get(apiUrl)
            .then((res) => {
                const productNamesArr = res.data.data.map((item) => ({
                    _id: item._id,
                    productName: item.product_name,
                    imageUrl: item.image_url,
                    productCost: item.cost,
                }));
                setProductNames((prevProductNames) => [...prevProductNames, ...productNamesArr]);
                setLoadingMore(false);
            })
            .catch((err) => console.log(err))
            // .finally(setLoadingMore(false))
    };
    

    useEffect(() => {
        if (searchQuery !== "") {
            axios.get(searchUrl + searchQuery)
                .then((res) => {
                    const filteredSearchResults = res.data.data.map((item) => ({
                        _id: item._id,
                        productName: item.product_name,
                        productCost: item.cost
                    }));
                    setFilteredProducts(filteredSearchResults);
                })
                .catch(err => console.log(err));
        } else {
            setFilteredProducts(productNames);
        }
    }, [searchQuery, productNames]);


    //on chaging search test

    const onChangeSearch = (query) => {
        setSearchQuery(query);
    };

    return (
        <View style={styles.container}>

            <View>
                <GoBack title="Products" onPress={() => navigation.goBack()} />
            </View>

            <View style={styles.searchContainer}>
                <Searchbar
                    placeholder="Search Products"
                    value={searchQuery}
                    onChangeText={onChangeSearch}
                    style={styles.searchBox}
                />
            </View>
            <View style={styles.productListContainer}>
                <FlatList
                    data={filteredProducts}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => <ProductList item={item} contact={contact} />}
                    numColumns={numColumns}
                    ListFooterComponent={renderLoader}
                    onEndReached={loadMoreItem}
                    onEndReachedThreshold={0.1}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchBox: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ffa600',
        backgroundColor: "white",
        marginBottom: 10,
    },
    searchContainer: {
        backgroundColor: "#ffa600",
        paddingHorizontal: 10,
    },
    productListContainer: {

        alignItems: "center",
        flex: 1,
    },
    loaderStyle: {
        marginVertical: 16,
        alignItems: "center",
        justifyContent: "center",
    }


});

export default ProductScreen;