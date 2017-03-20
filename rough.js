              <View style={styles.ItemList}>
                <View style={styles.Company}>
                  <Image
                    source={{uri: data.picture}}
                    style={styles.imageItems}
                  />
                  <Text style={styles.CompanyName}>{data.name}</Text>
                </View>
                <TextInput 
                  ref={data.id}
                  style={styles.InputBoxItems} 
                  placeholder='Enter Price'
                  keyboardType={'numeric'}
                  onChangeText={(orderSize) => this.setState({orderSize})}
                />
                <TouchableHighlight style={styles.button} onPress={() => this._saveOrder(data.id)} underlayColor='#99d9f4'>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableHighlight>        
              </View>