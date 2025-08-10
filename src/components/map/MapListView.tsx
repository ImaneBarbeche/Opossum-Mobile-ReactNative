import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme';
import { listingCardStyles } from '../../theme/listingCardStyles';
import { Ionicons } from '@expo/vector-icons';
import { getCategoryLabel, getCategoryEmoji } from '../../utils/categories';

interface MapListViewProps {
  listings: any[];
  currentUserId?: string;
}

import { useNavigation } from '@react-navigation/native';

const MapListView: React.FC<MapListViewProps> = ({ listings, currentUserId }) => {
  const navigation = useNavigation<any>();
  // Debug: log image fields for each listing
  React.useEffect(() => {
    listings.forEach(item => {

    });
  }, [listings]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.lightGray, paddingTop: 64 }} edges={["top"]}>
      {listings.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 32, color: colors.darkGray }}>Aucune annonce trouvée.</Text>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={item => item.id?.toString()}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => navigation.navigate('Mes annonces', { screen: 'ObjectDetail', params: { id: item.id } })}
                activeOpacity={0.9}
                style={{ marginHorizontal: 8, marginVertical: 6 }}
              >
                <View style={[listingCardStyles.card, { flexDirection: 'row', alignItems: 'center' }]}> 
                  <View style={listingCardStyles.imageContainer}>
                    {/* Affiche l'image seulement si l'URL n'est pas un placeholder */}
                    {(() => {
                      const isValid = (url) => typeof url === 'string' && url.trim() !== '' && !url.includes('via.placeholder.com/150?text=No+Image');
                      if (isValid(item.thumbnailUrl)) {
                        return <Image source={{ uri: item.thumbnailUrl }} style={listingCardStyles.image} />;
                      } else if (isValid(item.photoUrl)) {
                        return <Image source={{ uri: item.photoUrl }} style={listingCardStyles.image} />;
                      } else if (isValid(item.imageUrl)) {
                        return <Image source={{ uri: item.imageUrl }} style={listingCardStyles.image} />;
                      } else {
                        return (
                          <Image
                            source={require('../../../assets/images/no-photo.png')}
                            style={listingCardStyles.image}
                            resizeMode="contain"
                          />
                        );
                      }
                    })()}
                  </View>
                  <View style={[listingCardStyles.content, { flex: 1 }]}> 
                    {/* Titre */}
                    <Text style={listingCardStyles.title}>{item.title}</Text>
                    {/* Catégorie avec emoji */}
                    <Text style={listingCardStyles.category}>
                      {getCategoryEmoji(item.category)} {getCategoryLabel(item.category)}
                    </Text>
                    {/* Description */}
                    <Text style={listingCardStyles.description} numberOfLines={2}>{item.description}</Text>
                    {/* Infos */}
                    <View style={listingCardStyles.infoRow}>
                      <Text style={listingCardStyles.infoText}>{item.city}</Text>
                      {item.distance !== undefined && (
                        <>
                          <Ionicons name="walk-outline" size={16} style={listingCardStyles.infoIcon} />
                          <Text style={listingCardStyles.infoText}>{item.distance.toFixed(1)} km</Text>
                        </>
                      )}
                    </View>
                  </View>
                  <View style={{ alignItems: 'flex-end', flex: 0 }}>
                    <View style={[ 
                      listingCardStyles.badge,
                      item.status === 'FOUND'
                        ? { backgroundColor: colors.success }
                        : item.status === 'RESOLVED'
                        ? { backgroundColor: colors.info }
                        : { backgroundColor: colors.error }
                    ]}>
                      <Text style={listingCardStyles.badgeText} numberOfLines={1} ellipsizeMode="tail">
                        {item.status === 'FOUND' ? 'Trouvé' : item.status === 'RESOLVED' ? 'Résolu' : 'Perdu'}
                      </Text>
                    </View>
                    {/* Badge Mon annonce si c'est l'utilisateur courant */}
                    {(currentUserId && (item.userId === currentUserId || item.owner?.id === currentUserId)) && (
                      <View style={[listingCardStyles.badge, { backgroundColor: colors.primary, marginTop: 6 }]}> 
                        <Text style={[listingCardStyles.badgeText, { color: colors.white }]}>Mon annonce</Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default MapListView;
