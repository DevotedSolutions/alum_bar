import {
  Page,
  Font,
  Document,
  Text,
  StyleSheet,
  View,
  Image,
} from "@react-pdf/renderer";
import React from "react";
import sideLogo from "../../assets/remove-bg-side.png";
import mainLogo from "../../assets/mainLogo.png";
import pdfLogoBottom from "../../assets/pdfLogoBottom.jpeg";
import { ROUND } from "../../utility/priceFormula";
import backgroundUrl from "../../assets/LogoBackground.png";

const PdfDocument = ({ cartItems,clientDetails,quotation}) => {
  console.log(backgroundUrl);
  const currentDate = new Date().toLocaleDateString();
  const totalQuantity = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalPrice = cartItems.reduce(
    (acc, curr) => acc + curr.price * curr.quantity,
    0
  );

  let tax = 0;
  const itemsWithTax = cartItems.filter((item) => item.tax);
  if (itemsWithTax.length > 0) {
    tax = itemsWithTax.reduce((acc, curr) => acc + curr.tax, 0);
  }

  const roundedTax = Math.ceil(tax);
  const totalAmount = totalPrice + roundedTax;

  const styles = StyleSheet.create({
    pageBackground: {
      position: "absolute",
      minWidth: "110%",
      minHeight: "110%",
      display: "block",
      height: "110%",
      width: "100%",
    },
    pageBackgroundContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      height: "100%",
      width: "100%",
    },
    body: {
      padding: "30px",
    },
    section_one: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      marginTop: "30px",
      textAlign: "center",
    },
    section_two: {
      display: "flex",
      //justifyContent: "space-evenly",
      flexDirection: "row",
      paddingTop: "50px",
    },
    customer_date: {
      backgroundColor: "#ffe6e6",
      padding: "3px",
      fontSize: "12px",

      // height: "14px",
      // width: "80px",
    },
    customer_detail: {
      marginLeft: "30px",
      width: "180px",
    },

    text_head: {
      fontSize: 20,
      color: "#004d00",
      fontWeight: "bold",
      textAlign: "center",
      fontStyle: "italic",
    },
    text_head_down: {
      fontSize: 16,
      color: "black",
      textAlign: "center",
      paddingTop: "5px",
    },
    text_head_add: {
      fontSize: "12px",
      color: "blue",
      fontWeight: "bold",
      textAlign: "center",
      fontFamily: "Helvetica-Bold",
      lineHeight: "2px",
    },
    text_head_email: {
      fontSize: 12,
      color: "red",
      textAlign: "center",
      lineHeight: "1.2px",
      fontWeight: 900,
      fontFamily: "Helvetica-Bold",
    },
    text_customer_head: {
      fontSize: "16px",
      fontWeight: 900,
      lineHeight: "1.5px",
      fontFamily: "Helvetica-Bold",
    },
    text_customer_detail: {
      fontSize: "16px",
      lineHeight: "1.5px",
    },
    table: {
      display: "table",
      width: "100%",
    },
    tablerow: {
      flexDirection: "row",
      width: "100%",
    },
    tablecell: {
      /// width: "100%",
      height: "30px",
      border: "1px solid black",
      fontSize: 10,
      textAlign: "center",
      alignItems: "center",
      display: "flex",
      justifyContent: "center",
    },
  });

  return (
    <Document
      style={{
        backgroundImage: `url(${backgroundUrl})`,
        backgroundSize: "cover",
      }}
    >
      <Page style={styles.body} size="a2">
        <View style={styles.pageBackgroundContainer}>
          <Image src={backgroundUrl} style={styles.pageBackground} />
        </View>
        <View
          style={{
            display: "flex",
            marginTop: "200px",
            flexDirection: "row",
            justifyContent: "space-between",
            
          }}
        >
          
      
           
          <View>
          <Image src={pdfLogoBottom} style={{ width: "150px" }} />
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                marginTop: "50px",
                
              }}
            >
              <View>
                <Text
                  style={{
                    fontWeight: 900,
                    fontFamily: "Helvetica-Bold",
                    fontSize: "16px",
                    marginBottom: "30px",
                  }}
                >
                  Devis No:
                </Text>
                <Text style={styles.text_customer_head}>Nom Client</Text>
                <Text style={styles.text_customer_head}>Tel</Text>
                <Text style={styles.text_customer_head}>Email</Text>
                <Text style={styles.text_customer_head}>Mesure Finale</Text>
              </View>
              <View style={styles.customer_detail}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    marginBottom: "30px",
                  }}
                >
                 {clientDetails.nomClient.includes(' ') ? clientDetails?.nomClient?.split(' ')[0]+quotation : clientDetails?.nomClient+quotation}
                </Text>
                <Text style={{...styles.text_customer_detail,textTransform: 'capitalize'}}>{clientDetails?.nomClient}</Text>
                <Text style={styles.text_customer_detail}>{clientDetails?.tel}</Text>
                <Text style={styles.text_customer_detail}>{clientDetails?.email}</Text>
                <Text style={styles.text_customer_detail}>{clientDetails?.mesureFinale ? "OUI" :"NON"}</Text>
              </View>
            </View>
          </View>
          <View>
            <Image
              src={sideLogo}
              style={{ width: "240px", marginBottom: "10px" }}
            />
            <Text
              style={{
                fontSize: "12px",
                fontWeight: 900,
                fontFamily: "Helvetica-Bold",
                lineHeight: "1.2px",
              }}
            >
              Royal Road st Paul Phoenix, Mauritius 73551
            </Text>
            <Text
              style={{
                fontSize: "12px",
                fontWeight: 900,
                fontFamily: "Helvetica-Bold",
                lineHeight: "1.2px",
              }}
            >
              Tel: +230 606 27 20
            </Text>
            <Text
              style={{
                fontSize: "12px",
                fontWeight: 900,
                fontFamily: "Helvetica-Bold",
                lineHeight: "1.2px",
              }}
            >
              Mob: +230 59 42 87 89
            </Text>
            <Text
              style={{
                fontSize: "12px",
                fontWeight: 900,
                fontFamily: "Helvetica-Bold",
                lineHeight: "1.2px",
              }}
            >
              Mob: +262 693 92 76 20
            </Text>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text
                style={{
                  fontSize: "12px",
                  fontWeight: 900,
                  fontFamily: "Helvetica-Bold",
                  lineHeight: "1.2px",
                }}
              >
                BRN: C16135473
              </Text>
              <Text
                style={{
                  fontSize: "12px",
                  fontWeight: 900,
                  fontFamily: "Helvetica-Bold",
                  lineHeight: "1.2px",
                }}
              >
                {" "}
                VAT: 27380199
              </Text>
            </View>
            <Text style={styles.text_head_email}>
              Email: contact@noutfermeture.com
            </Text>
            <Text
              style={{
                fontSize: "12px",
                color: "red",
                textAlign: "center",
                textDecoration: "underline",
                lineHeight: "1.2px",
              }}
            >
              www.noutfermeture.com
            </Text>
          </View>
        </View>
        <View style={styles.section_one}>
          <Text
            style={{
              fontSize: "16px",
              fontWeight: 900,
              fontFamily: "Helvetica-Bold",
              color: "#A73E03",
            }}
          >
            DEVIS Sur Mesure
          </Text>
        </View>

        <View style={{ marginTop: "50px" }}>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tablerow}>
              <View
                style={{
                  ...styles.tablecell,
                  backgroundColor: "#C0C0C0",
                  width: "100%",
                }}
              >
                <Text style={{ fontWeight: 900, fontFamily: "Helvetica-Bold" }}>
                  Gamme
                </Text>
              </View>
              <View
                style={{
                  ...styles.tablecell,
                  backgroundColor: "#C0C0C0",
                  width: "50%",
                }}
              >
                <Text style={{ fontWeight: 900, fontFamily: "Helvetica-Bold" }}>
                  Rep
                </Text>
              </View>
              <View
                style={{
                  ...styles.tablecell,
                  backgroundColor: "#C0C0C0",
                  width: "170%",
                }}
              >
                <Text style={{ fontWeight: 900, fontFamily: "Helvetica-Bold" }}>
                  DESIGNATION
                </Text>
              </View>
              <View
                style={{
                  ...styles.tablecell,
                  backgroundColor: "#C0C0C0",
                  width: "130%",
                }}
              >
                <Text style={{ fontWeight: 900, fontFamily: "Helvetica-Bold" }}>
                  SERR./CERMONE
                </Text>
              </View>
              <View
                style={{
                  ...styles.tablecell,
                  backgroundColor: "#C0C0C0",
                  width: "100%",
                }}
              >
                <Text style={{ fontWeight: 900, fontFamily: "Helvetica-Bold" }}>
                  Vitrage
                </Text>
              </View>
              <View
                style={{
                  ...styles.tablecell,
                  backgroundColor: "#C0C0C0",
                  width: "100%",
                }}
              >
                <Text style={{ fontWeight: 900, fontFamily: "Helvetica-Bold" }}>
                  Dimensions
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{
                      borderTop: "1px solid black",
                      height: "15px",
                      marginTop: "5px",
                      width: "50%",
                      fontWeight: 900,
                      fontFamily: "Helvetica-Bold",
                    }}
                  >
                    Larguer
                  </Text>
                  <Text
                    style={{
                      fontWeight: 900,
                      fontFamily: "Helvetica-Bold",
                      borderTop: "1px solid black",
                      height: "15px",
                      marginTop: "5px",
                      width: "50%",
                    }}
                  >
                    Hautuer
                  </Text>
                </View>
              </View>
              <View
                style={{
                  ...styles.tablecell,
                  backgroundColor: "#C0C0C0",
                  width: "50%",
                }}
              >
                <Text style={{ fontWeight: 900, fontFamily: "Helvetica-Bold" }}>
                  Quantity
                </Text>
              </View>
              <View
                style={{
                  ...styles.tablecell,
                  backgroundColor: "#C0C0C0",
                  width: "100%",
                }}
              >
                <Text style={{ fontWeight: 900, fontFamily: "Helvetica-Bold" }}>
                  Prix unitaire
                </Text>
              </View>
              <View
                style={{
                  ...styles.tablecell,
                  backgroundColor: "#C0C0C0",
                  width: "100%",
                }}
              >
                <Text style={{ fontWeight: 900, fontFamily: "Helvetica-Bold" }}>
                  Montant
                </Text>
              </View>
            </View>

            <View style={styles.tablerow}>
              <View
                style={{
                  width: "100%",
                  height: "15px",
                  border: "1px solid black",
                  backgroundColor: "#C0C0C0",
                }}
              ></View>
              <View
                style={{
                  width: "50%",
                  height: "15px",
                  border: "1px solid black",
                  backgroundColor: "#C0C0C0",
                }}
              ></View>
              <View
                style={{
                  width: "170%",
                  height: "15px",
                  border: "1px solid black",
                  backgroundColor: "#C0C0C0",
                }}
              ></View>
              <View
                style={{
                  width: "130%",
                  height: "15px",
                  border: "1px solid black",
                  backgroundColor: "#C0C0C0",
                }}
              ></View>
              <View
                style={{
                  width: "100%",
                  height: "15px",
                  border: "1px solid black",
                  backgroundColor: "#C0C0C0",
                }}
              ></View>
              <View
                style={{
                  width: "100%",
                  height: "15px",
                  border: "1px solid black",
                  backgroundColor: "#C0C0C0",
                }}
              ></View>
              <View
                style={{
                  width: "50%",
                  height: "15px",
                  border: "1px solid black",
                  backgroundColor: "#C0C0C0",
                }}
              ></View>
              <View
                style={{
                  width: "100%",
                  height: "15px",
                  border: "1px solid black",
                  backgroundColor: "#C0C0C0",
                }}
              ></View>
              <View
                style={{
                  width: "100%",
                  height: "15px",
                  border: "1px solid black",
                  backgroundColor: "#C0C0C0",
                }}
              ></View>
            </View>

            {/* Cotis Devis */}
            <View style={styles.tablerow}>
              <View style={{ ...styles.tablecell, width: "100%" }}></View>
              <View style={{ ...styles.tablecell, width: "50%" }}></View>
              <View style={{ ...styles.tablecell, width: "170%" }}></View>
              <View style={{ ...styles.tablecell, width: "130%" }}></View>
              <View style={{ ...styles.tablecell, width: "100%" }}></View>
              <View style={{ ...styles.tablecell, width: "100%" }}>
                <Text
                  style={{
                    fontWeight: 900,
                    fontFamily: "Helvetica-Bold",
                    fontSize: "14px",
                  }}
                >
                  Cotes Devis
                </Text>
              </View>
              <View style={{ ...styles.tablecell, width: "50%" }}></View>
              <View style={{ ...styles.tablecell, width: "100%" }}></View>
              <View style={{ ...styles.tablecell, width: "100%" }}>
                {" "}
                <Text>- €</Text>
              </View>
            </View>
            {/* Table Body */}
            {cartItems.map((item, index) => (
              <View key={index} style={styles.tablerow}>
                <View style={{ ...styles.tablecell, width: "100%" }}>
                  <Text>{item.color}</Text>
                </View>
                <View style={{ ...styles.tablecell, width: "50%" }}>
                  <Text>{item.rep}</Text>
                </View>
                <View style={{ ...styles.tablecell, width: "170%" }}>
                  <Text>{item.designation}</Text>
                </View>
                <View style={{ ...styles.tablecell, width: "130%" }}>
                  <Text>{item.cermone === "undefined" ? "" : item.cermone}</Text>
                </View>
                <View style={{ ...styles.tablecell, width: "100%" }}>
                  <Text>{item.vitrage === "undefined" ? "" :  item.vitrage}</Text>
                </View>
                <View style={{ ...styles.tablecell, width: "100%" }}>
                  <View style={{ flexDirection: "row", height: "100%" }}>
                    <View
                      style={{
                        borderLeft: "1px solid black",
                        height: "100%",
                        width: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text>{item.largeur} mm</Text>
                    </View>
                    <View
                      style={{
                        borderLeft: "1px solid black",
                        height: "100%",
                        width: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text>{item.hauteur} mm</Text>
                    </View>
                  </View>
                </View>
                <View style={{ ...styles.tablecell, width: "50%" }}>
                  <Text>{item.quantity}</Text>
                </View>
                <View style={{ ...styles.tablecell, width: "100%" }}>
                  <Text>{item.price} €</Text>
                </View>
                <View style={{ ...styles.tablecell, width: "100%" }}>
                  <Text>{item.price * item.quantity} €</Text>
                </View>
              </View>
            ))}
            <View
              style={{ display: "flex", flexDirection: "row", width: "100%" }}
            >
              <View style={{ width: "49.9%", marginTop: "10px" }}>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <View>
                    <Image src={mainLogo} style={{ width: "200px" }} />
                  </View>
                  <View>
                    <Text
                      style={{
                        fontSize: "12px",
                        fontWeight: 900,
                        fontFamily: "Helvetica-Bold",
                        lineHeight: "2px",
                      }}
                    >
                      497 Route Departementale, 97630 Mtsamboro
                    </Text>
                    <Text
                      style={{
                        fontSize: "12px",
                        fontWeight: 900,
                        fontFamily: "Helvetica-Bold",
                        lineHeight: "2px",
                      }}
                    >
                      Tel: +262 693 92 76 20
                    </Text>
                    <Text style={styles.text_head_add}>
                      Sarl au capital de 1000 Euros No. Siret 918 757 378
                    </Text>
                    <Text
                      style={{ ...styles.text_head_email, lineHeight: "2px" }}
                    >
                      Email: contact@noutfermeture.com
                    </Text>
                  </View>
                </View>
              </View>

              <View
                style={{
                  width: "50.1%",
                }}
              >
                {/* total furniture rows */}
                <View style={styles.tablerow}>
                  <View
                    style={{
                      width: "200%",
                      height: "30px",
                      border: "1px solid black",
                      fontSize: "14px",
                      textAlign: "center",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text>Total Menuiserie</Text>
                  </View>

                  <View style={{ ...styles.tablecell, width: "50%" }}>
                    <Text>{totalQuantity}</Text>
                  </View>
                  <View style={{ ...styles.tablecell, width: "100%" }}></View>
                  <View style={{ ...styles.tablecell, width: "100%" }}></View>
                </View>

                {/* total price row */}
                <View style={styles.tablerow}>
                  <View
                    style={{
                      width: "350%",
                      height: "30px",
                      border: "1px solid black",
                      fontSize: "14px",
                      textAlign: "center",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text>Total Furniture</Text>
                  </View>

                  <View style={{ ...styles.tablecell, width: "100%" }}>
                    <Text>{totalPrice} €</Text>
                  </View>
                </View>

                {/* totalTaxRow */}

                <View style={styles.tablerow}>
                  <View style={{ width: "100%", height: "30px" }}></View>
                  <View
                    style={{
                      width: "150%",
                      height: "30px",
                      border: "1px solid black",
                      fontSize: "14px",
                      textAlign: "center",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text>Forfait Pose T.T.C</Text>
                  </View>
                  <View style={{ ...styles.tablecell, width: "100%" }}></View>

                  <View style={{ ...styles.tablecell, width: "100%" }}>
                    <Text> {roundedTax} €</Text>
                  </View>
                </View>

                {/* total bil after tax */}

                <View style={styles.tablerow}>
                  <View style={{ width: "100%", height: "30px" }}></View>
                  <View
                    style={{
                      width: "250%",
                      height: "30px",
                      border: "1px solid black",
                      fontSize: "14px",
                      textAlign: "center",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text>TOTAL T.T.C Livree Mayotte</Text>
                  </View>
                  <View style={{ ...styles.tablecell, width: "100%" }}>
                    <Text>{totalAmount} €</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View
          style={{
            width: "100%",
            display: "flex",
            marginTop: "30px",
            border: "2px solid black",
            paddingBottom: "15px",
          }}
        >
          <View
            style={{
              backgroundColor: "#C0C0C0",
              borderBottom: "2px solid black",
              padding: "3px",
            }}
          >
            <Text
              style={{
                fontSize: "12px",
              }}
            >
              LES CONDITIONS DU CONTRAT ET DE LA VENTE
            </Text>
          </View>
          <View
            style={{
              padding: "3px",
            }}
          >
            <Text
              style={{
                fontSize: "12px",
              }}
            >
              La Livraison sera effectuée entre la 4éme et la 6éme semaines
              après la date de prise de côtes
            </Text>
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                textAlign: "center",
                marginVertical: "20px",
              }}
            >
              <Text style={{ fontSize: "12px" }}>
                {" "}
                <Text style={{ fontWeight: 900, fontFamily: "Helvetica-Bold" }}>
                  Mode de Paiement:{" "}
                </Text>
                50 % du Montant a la confirmation de commande
              </Text>
              <Text style={{ fontSize: "12px" }}>
                {" "}{" "}
                50 % 5 Jours avant Livraison
              </Text>
            </View>
            <Text
              style={{
                fontSize: "12px",
                fontWeight: 900,
                fontFamily: "Helvetica-Bold",
              }}
            >
              Validité: Ce devis est valable seulement si la commande est
              confirmée sous 30 jours date de devis
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PdfDocument;
