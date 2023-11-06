import { Alert, StyleSheet, Text, View, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { apiURL, getData, storeData } from '../../utils/localStorage';
import { colors, fonts, windowHeight, windowWidth } from '../../utils';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { showMessage } from 'react-native-flash-message';
import Sound from 'react-native-sound';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { MyButton, MyGap, MyInput } from '../../components';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';

export default function Home({ navigation }) {
  const isFocused = useIsFocused();
  const [user, setUser] = useState({});
  const [data, setData] = useState({
    a: 0,
    aHasil: 1,
    b: 0,
    bHasil: 0,
    INDEX: 0
  });



  useEffect(() => {


    getData('user').then(res => {
      setUser(res);
    })
  }
    , []);





  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: colors.white,
    }}>
      {/* header */}
      <View style={{
        height: windowHeight / 7,
        backgroundColor: colors.primary,
        paddingHorizontal: 10,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        paddingVertical: 20,
      }}>
        <View style={{
          flexDirection: 'row',
          marginBottom: 5,
        }}>
          <View style={{
            flex: 1,
          }}>
            <Text style={{

              fontFamily: fonts.secondary[400],
              fontSize: windowWidth / 28,
              color: colors.white
            }}>Welcome, {user.nama_lengkap}</Text>
            <Text style={{
              fontFamily: fonts.secondary[600],
              fontSize: windowWidth / 20,
              color: colors.white
            }}>
              Moisture Calculator
            </Text>
          </View>


          <TouchableOpacity onPress={() => {
            storeData('user', null);

            navigation.replace('Login');
          }} style={{

            padding: 10,
            borderRadius: 5,
            flexDirection: 'row',
            backgroundColor: colors.white,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Icon type="ionicon" size={windowWidth / 30} name="log-out-outline" color={colors.primary} />
            <Text style={{
              left: 5,
              fontFamily: fonts.secondary[600],
              fontSize: windowWidth / 30,
              color: colors.primary
            }}>Logout</Text>
          </TouchableOpacity>
        </View>



      </View>

      {/* calculator */}


      <ScrollView showsVerticalScrollIndicator={false} style={{
        padding: 10,
      }}>

        <MyInput onChangeText={x => {
          setData({
            ...data,
            a: x,
          })

        }} keyboardType='numeric' textAlign="center" pakaiicon={false} value={data.a} iconname='create-outline' label="Dew Point (°C)" />

        <MyGap jarak={20} />
        <MyButton Icons="refresh" title="Calculate" warna={colors.primary} onPress={() => {
          console.log('input', data.a)
          if (data.a >= -100 && data.a <= -51) {
            var A = 6.1115;
            var B = 22.5420;
            var C = 273.4800;

          } else if (data.a >= -50 && data.a <= -41) {
            var A = 6.1115;
            var B = 22.4520;
            var C = 272.5500;
          } else if (data.a >= -40 && data.a <= -21) {
            var A = 6.1121;
            var B = 17.9660;
            var C = 247.1500;
          } else if (data.a >= -20 && data.a <= 50) {
            var A = 6.1121;
            var B = 17.5020;
            var C = 240.9700;
          }

          var CTAMBAHA = (parseFloat(C) + parseFloat(data.a)).toFixed(2);
          var BKALIA = (parseFloat(B) * parseFloat(data.a)).toFixed(2);
          var _cek1 = (BKALIA / CTAMBAHA).toFixed(7);
          var _cek2 = Math.exp(_cek1).toFixed(7);
          var hPa = (parseFloat(A) * parseFloat(_cek2)).toFixed(7);
          var pa = (100 * hPa).toFixed(7);
          var mmHg = (0.007500638 * pa);
          var ppm = (mmHg / 760 * 1000000).toFixed(4);

          console.log('CTAMBAHA', CTAMBAHA)
          console.log('BKALIA', BKALIA)
          console.log('(B.Tbaca/(C+Tbaca))', _cek1)
          console.log('e(B.Tbaca/(C+Tbaca)', _cek2)
          console.log('Hpa', hPa)
          console.log('pa', pa)
          console.log('mmHg', mmHg)

          console.log('ppm', ppm);
          setData({
            ...data,
            INDEX: ppm
          })


        }} />

        <View style={{
          flex: 1,
          marginTop: 20,
          justifyContent: 'center',
          alignItems: 'center'
        }}>


          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <Text style={{ fontSize: 20, lineHeight: 18, color: colors.primary, fontFamily: fonts.secondary[600], fontSize: windowWidth / 35 }}>Moisture Content - H</Text>
            <Text style={{ fontSize: 7, lineHeight: 25, color: colors.primary, fontFamily: fonts.secondary[600], fontSize: windowWidth / 35 }}>2</Text>
            <Text style={{ fontSize: 20, lineHeight: 18, color: colors.primary, fontFamily: fonts.secondary[600], fontSize: windowWidth / 35 }}>O (ppm)</Text>
          </View>
          <View style={{
            backgroundColor: colors.tertiary,
            width: '100%',
            borderRadius: 5,
            marginTop: 2,
            justifyContent: 'center',
            alignItems: 'center', height: 50,
          }}>
            <Text style={{
              textAlign: 'center',
              fontFamily: fonts.secondary[600],
              fontSize: windowWidth / 15
            }}>{data.INDEX == "NaN" ? "Out of Range" : data.INDEX}</Text>
          </View>
        </View>
        <MyGap jarak={50} />
        <Text style={{
          textAlign: 'center',
          fontFamily: fonts.secondary[600],
          color: colors.border,
          margin: 5,
        }}>Base on August-Roche-Magnus approximation</Text>
      </ScrollView>






      <View>
        <Text style={{
          textAlign: 'center',
          padding: 10,
          backgroundColor: colors.white,
          color: colors.black,
          fontSize: windowWidth / 28,
          fontFamily: fonts.primary[600],
        }}>Copyright © 2022 | Laboratory of Pupuk Kaltim</Text>
      </View>



    </SafeAreaView >
  )
}

const styles = StyleSheet.create({
  judul: {
    fontFamily: fonts.secondary[600],
    fontSize: windowWidth / 35
  },
  item: {
    fontFamily: fonts.secondary[400],
    fontSize: windowWidth / 35
  }
})